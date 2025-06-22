const app = require("express")();
const { Client } = require("pg");
const crypto = require("crypto");
const ConsistentHash = require("hashring");
const hr = new ConsistentHash();
hr.add("5432");
hr.add("5433");
hr.add("5434");

const clients = {
    "5432": new Client({
        "host": "127.0.0.1",
        "database": "postgres",
        "user": "postgres",
        "password": "postgres",
        "port": 5432
    }),
    "5433": new Client({
        "host": "127.0.0.1",
        "database": "postgres",
        "user": "postgres",
        "password": "postgres",
        "port": 5433
    }),
    "5434": new Client({
        "host": "127.0.0.1",
        "database": "postgres",
        "user": "postgres",
        "password": "postgres",
        "port": 5434
    })
};

connect();
async function connect() {
    await clients["5432"].connect();
    await clients["5433"].connect();
    await clients["5434"].connect();
}

app.get("/:urlId", async (req, res) => {  
    const urlId = req.params.urlId;
    const server = hr.get(urlId);
    const respose = await clients[server].query("SELECT URL FROM URL_TABLE WHERE URL_ID = $1", [urlId]);
    if (respose.rows.length > 0) {
        res.send({
            "urlId": urlId, 
            "url": respose.rows[0].url,
            "server": server
        });
    } else {
        res.status(404).send("URL not found");
    }
}); 

app.post("/", async (req, res) => {
    const url = req.query.url;
    const hash = crypto.createHash("sha256").update(url).digest("base64");
    const urlId = hash.substr(0, 5);
    const server = hr.get(urlId);
    await clients[server].query("INSERT INTO URL_TABLE (URL, URL_ID) VALUES ($1, $2)", [url, urlId]);
    res.send({ "hash": hash, "urlId": urlId, "server": server });
});

app.listen(8081, () => { console.log("Server is running on port 3000") });
