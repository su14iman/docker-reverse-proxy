# docker-revers-proxy
docker-revers-proxy is a Node.js application that allows you to proxy incoming HTTP requests to Docker containers based on the request URL. This is particularly useful when you have multiple Docker containers running on the same host, and you want to route incoming requests to specific containers based on the URL.

The script uses a method similar to CodeSpaces to route the subdomain to the container.
- `test-80.your-domain.com`
    - `test` is the container name or ID.
    - `80` is the port within the container.
> This means that the subdomain is routed to the specified container.


## Prerequisites
Before you can use this application, make sure you have the following prerequisites:

- Node.js: You need Node.js installed on your system.
- Docker: Docker should be installed and running on your host.
- Environment Variables: You need to configure your environment variables in a `.env` file. Ensure that you have the following variables set:

  - `RP_DOMAIN`: The domain where the proxy will be running.
  - `RP_PORT`: The port on which the proxy server will listen.
  - `RP_DEBUG`: Set to "TRUE" if you want to enable debug mode.



## Installation
1. Clone this repository to your local machine.
2. Navigate to the project directory.

```bash
cd docker-revers-proxy
npm install
```

## Usage

```
npm run start
```


## How It Works
1. The proxy server reads the environment variables from the .env file, including the domain and port to listen on, and whether debug mode is enabled.
2. It creates a RedWire instance and listens for incoming HTTP requests.
3. It queries the Docker API to get a list of running containers on the host.
4. For each container, it extracts the container ID, name, and IP address and stores this information in a list.
5. When an HTTP request comes in, the proxy server extracts the URL and searches for a matching container based on the URL parameters.
6. If a matching container is found, the server creates a new route for that URL and proxies the request to the container using RedWire.
7. If no matching container is found, a 404 Not Found response is sent.
8. If an error occurs during the process, a 500 Internal Server Error response is sent.


## Debug Mode
You can enable debug mode by setting the RP_DEBUG environment variable to "TRUE" in your .env file. When debug mode is enabled, the application will log additional information to the console, which can be helpful for troubleshooting.



## Troubleshooting

### Error: listen EACCES: permission denied 0.0.0.0:80
If you encounter the error message "Error: listen EACCES: permission denied 0.0.0.0:80," it means that your application is trying to listen on port 80, but it does not have the necessary permissions. Port 80 is a privileged port, which means that only applications running with root privileges can bind to it.

Here are some possible solutions to this problem:

1. **Run your application as root:** This is the simplest solution, but it is also the least secure. If you run your application as root, it will have access to all of the files and resources on your system.

2. **Use a non-privileged port:** You can also configure your application to listen on a non-privileged port, such as 8080 or 8081. This is a more secure option, but it means that you will need to forward the port in your router or firewall to access your application from the internet.

3. **Use a proxy server:** Another option is to use a proxy server to listen on port 80 and then forward traffic to your application on a non-privileged port. This is a good option if you need to run your application on a shared server or if you want to add additional security features, such as SSL/TLS. (like nginxproxymanager, etc..)



## Todos
Here are some of the upcoming features and improvements that I plan to add to the docker-revers-proxy:

- **Support for HTTPS Connections:** I intend to enhance the proxy to support secure HTTPS connections. This will include the ability to configure SSL/TLS certificates for encrypted communication, providing a more secure and robust solution.



## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request


## License
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).


Enjoy using the Docker Reverse Proxy! <3