const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

// Load the proto file
const PROTO_PATH = path.join(__dirname, "service.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const example = protoDescriptor.example;

// Implement the SayHello RPC
function sayHello(call, callback) {
  const name = call.request.name;
  if (!name) {
    callback(new Error("No value supplied"));
    return;
  }
  callback(null, { message: `Hello, ${name}!` });
}

// Start the server
function main() {
  const server = new grpc.Server();
  const PORT = "50051";
  server.addService(example.Greeter.service, { SayHello: sayHello });
  server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Server is running on port ${port}`);
    }
  );
}

main();
