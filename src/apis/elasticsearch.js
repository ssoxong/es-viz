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
        const response = await elasticsearch.get(`_cat/indices?v&h=index,status,uuid,docs.count,store.size&format=json`, query);
        return response.data.filter((index) => !index.index.startsWith("."));
    } catch (error) {
        console.error("Error querying Elasticsearch:", error);
        throw error;
    }
};
