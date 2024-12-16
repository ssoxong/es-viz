import axios from "axios";

const elasticsearch = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

export const getIndexData = async (index, query) => {
    console.log("getIndexData", index, query);
    try {
        const response = await elasticsearch.post(`/index/${index}/search`, query);
        return response.data;
    } catch (error) {
        console.error("Error querying index:", error);
        throw error;
    }
};

export const createIndexData = async (indexName, {id, body}) => {
    try {
        const response = await elasticsearch.post(`/index/${indexName}/document`, {
            id,
            body: JSON.stringify(body)
        });
        return response.data;
    } catch (error) {
        console.error("Error creating document:", error);
        throw error;
    }
};

export const getIndex = async () => {
    try {
        const response = await elasticsearch.get("/indices");
        return response.data;
    } catch (error) {
        console.error("Error querying indices:", error);
        throw error;
    }
};

export const deleteIndex = async (indexlist) => {
    try {
        const promises = indexlist.map(index =>
            elasticsearch.delete(`/index/${index}`)
        );
        const responses = await Promise.all(promises);
        return responses.map(response => response.data);
    } catch (error) {
        console.error("Error deleting indices:", error);
        throw error;
    }
};

export const deleteIndexData = async (index, ids) => {
    try {
        const response = await elasticsearch.post(`/index/${index}/delete`, ids);
        return response.data;
    } catch (error) {
        console.error("Error deleting index data:", error);
        throw error;
    }
};

export const updateIndexData = async (index, id, doc) => {
    try {
        const response = await elasticsearch.post(`/index/${index}/update/${id}`, doc);
        return response.data;
    } catch (error) {
        console.error("Error updating index data:", error);
        throw error;
    }
};

export const createIndex = async ({indexName, shards, replicas}) => {
    try {
        const response = await elasticsearch.post("/index", {
            indexName,
            shards,
            replicas,
        });
        return response.data;
    } catch (error) {
        console.error("Error creating index:", error);
        throw error;
    }
};
