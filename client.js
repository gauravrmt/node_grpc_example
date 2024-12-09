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

// Create the client
const client = new example.Greeter(
  "localhost:50051",
  grpc.credentials.createInsecure()
);
// Call the SayHello RPC
client.SayHello({ name: "ankit" }, (err, response) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log("Greeting:", response.message);
});
