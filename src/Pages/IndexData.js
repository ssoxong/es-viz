import React, {useEffect, useState} from "react";
import {Button, Table} from "antd";
import {deleteIndexData, getIndexData} from "../apis/elasticsearch";
import {useParams} from "react-router-dom";

const IndexData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [columns, setColumns] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 선택된 행 키

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
                        // .filter((key) => key !== "id")
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

    const handleDeleteSelected = async () => {
        const result = await deleteIndexData(detailIndex.index, selectedRowKeys);
        console.log(result.data)
        const filteredData = data.filter((item) => !selectedRowKeys.includes(item.id));
        setData(filteredData); // 테이블 데이터 업데이트
        setSelectedRowKeys([]); // 선택된 키 초기화
    };

    // 멀티 선택 설정
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    return (
        <div style={{padding: "20px"}}>
            <h1>IndexData</h1>
            {loading && <p>Loading data...</p>}
            {error && <p>Error: {error}</p>}
            <Button
                onClick={handleDeleteSelected}
                type="primary"
                danger
                disabled={selectedRowKeys.length === 0} // 선택된 행 없으면 비활성화
                style={{marginBottom: "10px"}}
            >
                Delete
            </Button>
            {!loading && !error && data.length > 0 && (


                <Table
                    dataSource={data} // 테이블에 데이터 전달
                    columns={columns} // 동적으로 생성된 컬럼 전달
                    rowKey="id" // 고유 키 설정
                    loading={loading}
                    rowSelection={rowSelection} // 멀티 선택 설정 추가
                />
            )}
        </div>
    );
};

export default IndexData;
