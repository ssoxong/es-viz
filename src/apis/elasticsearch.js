import axios from "axios";

const elasticsearch = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getIndexData = async (index, query) => {
    console.log("getIndexData", index, query);
    try {
        const response = await elasticsearch.post(`/${index}/_search`, query);
        return response.data;
    } catch (error) {
        console.error("Error querying Elasticsearch:", error);
        throw error;
    }
};
export const createIndexData = async (indexName, {id, body}) => {
    try {
        const url = id ? `/${indexName}/_doc/${id}` : `/${indexName}/_doc`; // ID가 없으면 자동 생성
        const response = await elasticsearch.post(url, JSON.parse(body));
        return response.data;
    } catch (error) {
        console.error("Error creating document:", error);
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
    try {
        console.log(index)
        const response = await elasticsearch.post(`/${index}/_delete_by_query`, q);
        return response.data;
    } catch (error) {
        console.error("Error querying Elasticsearch:", error);
        throw error;
    }
};
export const updateIndexData = async (index, id, doc) => {
    console.log(doc)
    // console.log({"doc": {doc}})
    return await elasticsearch.post(`/${index}/_update/${id}`, JSON.stringify({doc}))
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