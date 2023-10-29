require('dotenv').config()
var RedWire = require('redwire');
var Docker = require('dockerode');

// Check .env file
if(!process.env.RP_DOMAIN) throw new Error("RP_DOMAIN not found in .env file")
if(!process.env.RP_PORT) throw new Error("RP_PORT not found in .env file")

// Get .env variables
const DOMAIN = process.env.RP_DOMAIN,
PORT = process.env.RP_PORT;
DEBUG = process.env.RP_DEBUG.toString() === "TRUE" ? true : false,
SERARCH_HOST = PORT.toString() !== "80" ? DOMAIN+":"+PORT : DOMAIN;

// Main function
const main = async function(){
    
    // Create a new RedWire instance
    var redwire = new RedWire({
        http: { port: PORT }
    });

    const containers = []; // Containers list
    const client = new Docker(); // Create a new docker client
    const dockerContainers = await client.listContainers(); // Get all containers
    
    // Add container to list
    for (const container of dockerContainers) {
        containers.push( 
            {
                id:container.Id.substring(0, 12), // container id
                name:container.Names[0].replace("/",""), // container name
                ip:container.NetworkSettings.Networks.bridge.IPAddress, // container ip
            }
        );
    }

    if(DEBUG) console.info("containers",containers); // DEBUG

    redwire.http('') // Default route
    .use(function (_mount, url, _req, res, next) {
        try {
            // Parse url
            const urlParseArray = url
            .replace(SERARCH_HOST,"")
            .replace("./","")
            .split("/"); 
            
            const urlData = urlParseArray[urlParseArray.length -1]; // Get last element
            const urlDataArray = urlData.split("-"); // Split by - to get id and port
    
            const urlID = urlDataArray[0]; // Container id or name
            const urlPort = urlDataArray[1]; // Container port
            
            // Search container by id or name
            let search = containers.find( c => c.name === urlID || c.id === urlID); 
            
            if(search){
                // Create a new route
                redwire.http( 
                    urlData+"."+DOMAIN
                ).use(
                    redwire.proxy(search.ip+":"+urlPort) // Proxy to container
                );
                if(DEBUG) console.info("200", url); // DEBUG
                next();
            }else{
                if(DEBUG) console.error("404", url); // DEBUG
                res.statusCode = 404; // response code
                res.end('404 Not Found'); // Send response
            }

        } catch (error) {
            if(DEBUG) console.error(error); // DEBUG
            res.statusCode = 500; // response code
            res.end('500 Internal Server Error'); // Send response
        }

    });

}

main().catch(); // Run main function