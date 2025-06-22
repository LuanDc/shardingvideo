# ShardingVideo

This project demonstrates, in a practical way, the concept of **database sharding** using Node.js, Express, PostgreSQL, and Consistent Hashing. The goal is to serve as an educational example and portfolio for developers interested in scalable relational database techniques.

## Context

**Sharding** is a technique for partitioning data across multiple smaller databases (shards), allowing load distribution and increased scalability for applications dealing with large volumes of data. In this project, URLs are stored in three separate PostgreSQL instances, and each request is routed to the correct shard using consistent hashing.

## Sharding: Pros and Cons

### Pros

- **Scalability:** Distributes data across multiple databases, allowing the system to handle much larger datasets and higher throughput.
- **Performance:** Reduces load on individual databases, improving query response times and reducing bottlenecks.
- **Fault Isolation:** Issues in one shard (such as hardware failure or corruption) are less likely to impact the entire system.
- **Flexible Growth:** New shards can be added as data volume increases, supporting horizontal scaling.
- **Resource Optimization:** Each shard can be optimized or tuned independently based on its specific workload.

### Cons

- **Increased Complexity:** Application logic must handle routing, connection management, and error handling across multiple databases.
- **Cross-shard Queries:** Performing queries that span multiple shards (such as joins or aggregations) becomes complex and often requires additional application logic or data denormalization.
- **Rebalancing Data:** As data distribution changes over time, moving data between shards (resharding) can be operationally challenging and may require downtime or complex migration scripts.
- **Consistency Guarantees:** Maintaining strong consistency and transactional guarantees across shards is difficult; distributed transactions are complex and can impact performance.
- **Operational Overhead:** Monitoring, backing up, and restoring multiple databases increases operational burden.
- **Development Overhead:** Developers must be aware of sharding logic and its implications, which can slow down development and debugging.

Sharding is a powerful tool for scaling databases, but it should be adopted with a clear understanding of these trade-offs and only when simpler solutions (like vertical scaling or read replicas) are

## Implementation

- **Node.js + Express:** API for registering and retrieving shortened URLs.
- **PostgreSQL:** Three instances simulating shards, each with the same table structure.
- **Consistent Hashing:** Used to distribute URLs among the shards in a balanced way.
- **Docker Compose:** Facilitates provisioning of the sharded databases.
- **hashring:** Library for implementing consistent hashing.

### Flow

1. **Register URL (`POST /?url=...`):**
   - The URL is hashed (SHA-256, base64, 5 characters).
   - The hash determines which shard will store the URL.
   - The URL and its identifier are inserted into the corresponding shard.

2. **Retrieve URL (`GET /:urlId`):**
   - The identifier is used to determine the shard.
   - The URL is fetched from the correct shard.

## How to run locally

### Prerequisites

- [Node.js 23+](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Steps

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/shardingvideo.git
   cd shardingvideo
   ```

2. **Build the Docker image for the shards:**
   ```sh
   docker build -t pgshard .
   ```

3. **Start the sharded databases:**
   ```sh
   docker-compose up -d
   ```

4. **Install Node.js dependencies:**
   ```sh
   npm install
   ```

5. **Start the API:**
   ```sh
   node index.js
   ```

6. **Testing the API:**

   - **Register a URL:**
     ```sh
     curl -X POST "http://localhost:8081/?url=https://example.com"
     ```
   - **Retrieve a URL:**
     ```sh
     curl "http://localhost:8081/<urlId>"
     ```

   The `urlId` field is returned in the registration response.

## Notes

- The shard ports are: 5432, 5433, and 5434.
- The default PostgreSQL user and password are `postgres`.
- This project is for educational purposes only and should not be used in production without adjustments.

---

Feel free to contribute or