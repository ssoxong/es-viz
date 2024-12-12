import React, {useEffect, useState} from "react";
import {Table} from "antd";
import {getIndexData} from "../apis/elasticsearch";
import {useParams} from "react-router-dom";

const IndexData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [columns, setColumns] = useState([]);

    const detailIndex = useParams();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Elasticsearch 데이터 가져오기
                const result = await getIndexData(detailIndex.index, {
                    query: {match_all: {}},
                });
                const hits = result.hits.hits.map((hit) => ({
                    id: hit._id,
                    ...hit._source,
                }));
                setData(hits);

                // 동적으로 컬럼 생성 (데이터 키 기반)
                if (hits.length > 0) {
                    const columns = Object.keys(hits[0])
                        .filter((key) => key !== "id")
                        .map((key) => ({
                            title: key.replace(/_/g, " ").toUpperCase(), // 키를 제목으로 변환
                            dataIndex: key, // 데이터 키
                            key: key, // 고유 키
                        }));
                    setColumns(columns);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [detailIndex]);

    return (
        <div style={{padding: "20px"}}>
            <h1>IndexData</h1>
            {loading && <p>Loading data...</p>}
            {error && <p>Error: {error}</p>}

            {!loading && !error && data.length > 0 && (
                <Table
                    dataSource={data} // 테이블에 데이터 전달
                    columns={columns} // 동적으로 생성된 컬럼 전달
                    rowKey="id" // 고유 키 설정
                    loading={loading}

                />
            )}
        </div>
    );
};

export default IndexData;
