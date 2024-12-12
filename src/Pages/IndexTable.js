import React, {useEffect, useState} from "react";
import {Button, Table} from "antd";
import {useNavigate} from "react-router-dom";
import {getIndex} from "../apis/elasticsearch";

const IndexTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [columns, setColumns] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 선택된 행 키
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getIndex();
                setData(result);

                // 동적으로 컬럼 생성 및 정렬 추가
                if (result.length > 0) {
                    const generatedColumns = Object.keys(result[0])
                        .map((key) => ({
                            title: key.replace(/_/g, " ").toUpperCase(),
                            dataIndex: key,
                            key: key,
                            sorter: (a, b) => {
                                if (typeof a[key] === "number") return a[key] - b[key]; // 숫자 정렬
                                if (typeof a[key] === "string") return a[key].localeCompare(b[key]); // 문자열 정렬
                                return 0;
                            },
                        }));
                    setColumns(generatedColumns);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 행 선택 핸들러
    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    // 선택된 행 삭제 핸들러
    const handleDeleteSelected = () => {
        const filteredData = data.filter((item) => !selectedRowKeys.includes(item.id));
        setData(filteredData); // 테이블 데이터 업데이트
        setSelectedRowKeys([]); // 선택된 키 초기화
    };

    // 멀티 선택 설정
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <div style={{padding: "20px"}}>
            <h1>IndexTable</h1>
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
                    dataSource={data}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    rowSelection={rowSelection} // 멀티 선택 설정 추가
                    onRow={(record) => ({
                        onClick: () => {
                            navigate(`/details/${record.index}`); // 행 클릭 시 상세 페이지로 이동
                        },
                    })}
                />
            )}
        </div>
    );
};

export default IndexTable;