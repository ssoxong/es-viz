import axios from "axios";

const elasticsearch = axios.create({
    baseURL: "http://localhost:9200",
    headers: {
        "Content-Type": "application/json",
    },
});

export const getIndexData = async (index, query = {}) => {
    try {
        const response = await elasticsearch.post(`/${index}/_search`, query);
        return response.data;
    } catch (error) {
        console.error("Error querying Elasticsearch:", error);
        throw error;
    }
};

export const getIndex = async (query = {}) => {
    try {
        const response = await elasticsearch.get(`_cat/indices?v&h=index,status,docs.count,store.size&format=json`, query);
        return response.data.filter((index) => !index.index.startsWith("."));
    } catch (error) {
        console.error("Error querying Elasticsearch:", error);
        throw error;
    }
};

export const deleteIndex = async (indexlist) => {
    const index = indexlist.join(',')
    try {
        const response = await elasticsearch.delete(`/${index}`,);
        return response.data;
    } catch (error) {
        console.error("Error querying Elasticsearch:", error);
        throw error;
    }
};

export const deleteIndexData = async (index, ids) => {
    const q = {
        "query": {
            "terms": {
                "_id": ids
            }
        }
    }
    console.log(index, q)
    try {
        const response = await elasticsearch.post(`/${index}/_delete_by_query`, q);
        return response.data;
    } catch (error) {
        console.error("Error querying Elasticsearch:", error);
        throw error;
    }
};

export const createIndex = async ({indexName, shards, replicas}) => {
    try {
        const response = await elasticsearch.put(`/${indexName}`, {
            settings: {
                number_of_shards: shards,
                number_of_replicas: replicas,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error querying Elasticsearch:", error);
        throw error;
    }
};