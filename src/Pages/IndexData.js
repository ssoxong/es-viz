import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Table} from "antd";
import {deleteIndexData, getIndexData} from "../apis/elasticsearch";
import {Link, useParams} from "react-router-dom";
import styled from "styled-components";
import UpdateModal from "../Components/UpdateModal";
import NewIndexDataModal from "../Components/NewIndexDataModal";
import {ButtonContainer} from "./IndexTable";

const IndexData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [columns, setColumns] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 선택된 행 키
    const [editingRow, setEditingRow] = useState(null); // 현재 수정 중인 행
    const [editModalVisible, setEditModalVisible] = useState(false); // 수정 모달 상태
    const [form] = Form.useForm(); // Ant Design Form instance
    const [searchQuery, setSearchQuery] = useState("*");
    const [indexPattern, setIndexPattern] = useState("*");
    const detailIndex = useParams();
    const setDataAndColumn = (result) => {
        console.log(result)
        const hits = result.hits.hits.map((hit) => ({
            index: hit._index, // _index 필드 추가
            id: hit._id,
            score: hit._score, // _score 필드 추가
            ...hit._source,

        }));
        setData(hits);

        // 동적으로 컬럼 생성 (데이터 키 기반)
        if (hits.length > 0) {
            const allKeys = new Set();
            hits.forEach(hit => Object.keys(hit).forEach(key => allKeys.add(key)));
            const columns = Array.from(allKeys).map((key) => ({
                title: key.replace(/_/g, " ").toUpperCase(), // 키를 제목으로 변환
                dataIndex: key, // 데이터 키
                key: key, // 고유 키
                onCell: () => ({
                    style: {maxWidth: 200},
                }),
            }));
            columns.push({
                title: "Actions",
                key: "actions",
                render: (_, record) => (
                    <Button
                        onClick={() => handleEditRow(record)}
                        type="link"
                    >
                        Edit
                    </Button>
                ),
            });
            setColumns(columns);
        }
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            // Elasticsearch 데이터 가져오기

            const result = await getIndexData(detailIndex.index, {
                query: {match_all: {}},
            });
            setDataAndColumn(result);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);

        }

    }

    useEffect(() => {
        setIndexPattern(detailIndex.index);
    }, []);

    useEffect(() => {
        fetchData();
    }, [detailIndex]);

    const handleEditRow = (record) => {
        setEditingRow(record);
        setEditModalVisible(true);
        form.setFieldsValue(record); // 기존 데이터 설정
    };
    const handleDeleteSelected = async () => {
        try {
            const finalIndexPattern = indexPattern.length === 0 ? "*" : indexPattern;

            const result = await deleteIndexData(finalIndexPattern, selectedRowKeys);
            console.log(result.data);
            const filteredData = data.filter((item) => !selectedRowKeys.includes(item.id));
            setData(filteredData); // 테이블 데이터 업데이트
            setSelectedRowKeys([]); // 선택된 키 초기화
            message.success("Selected documents deleted successfully.");
        } catch (error) {
            message.error("Failed to delete selected documents.");
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const finalIndexPattern = indexPattern.length === 0 ? "*" : indexPattern;
            const finalSearchQuery = searchQuery.length === 0 ? "*" : searchQuery;

            const result = await getIndexData(finalIndexPattern, {
                query: {
                    query_string: {
                        query: finalSearchQuery,
                    },
                },
            });

            setDataAndColumn(result);
        } catch (error) {
            message.error("Failed to fetch search results.");
        } finally {
            setLoading(false);
        }
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
            <Link to={"/"} style={{textDecoration: 'none', color: 'inherit'}}>
                <h1>INDEX: {detailIndex.index} ({data.length === 0 ? 0 : data.length})</h1>
            </Link>
            {loading && <p>Loading data...</p>}
            {error && <p>Error: {error}</p>}
            <SearchContainer>
                <SearchComponentContainer>
                    <SearchTitle>index pattern</SearchTitle>
                    <Input
                        placeholder="Enter index pattern"
                        value={indexPattern}
                        onChange={(e) => setIndexPattern(e.target.value)}
                    />
                </SearchComponentContainer>
                <SearchComponentContainer>
                    <SearchTitle>Search</SearchTitle>
                    <Input.Search
                        placeholder="Search"
                        enterButton="Search"
                        onSearch={handleSearch}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                    />
                </SearchComponentContainer>
            </SearchContainer>


            {!loading && !error && data.length > 0 && (
                <Table
                    dataSource={data} // 테이블에 데이터 전달
                    columns={columns} // 동적으로 생성된 컬럼 전달
                    rowKey="id"
                    // rowKey={(record) => `${record.index}_${record.id}`} // 고유 키 설정
                    loading={loading}
                    rowSelection={rowSelection} // 멀티 선택 설정 추가
                    scroll={{x: "max-content"}} // 가로 스크롤 추가
                />
            )}


            <ButtonContainer>
                <NewIndexDataModal
                    indexName={detailIndex.index}
                    onDocumentCreated={fetchData}
                />

                <Button
                    onClick={handleDeleteSelected}
                    type="primary"
                    danger
                    disabled={selectedRowKeys.length === 0} // 선택된 행 없으면 비활성화
                    style={{marginBottom: "10px"}}
                >
                    Delete
                </Button>

            </ButtonContainer>

            <UpdateModal
                visible={editModalVisible}
                editingRow={editingRow}
                setEditingRow={setEditingRow}
                setEditModalVisible={setEditModalVisible}
                data={data}
                setData={setData}
            />
        </div>
    );
};

export default IndexData;

const SearchContainer = styled.div`
    display: flex;
    gap: 10px;
`
const SearchComponentContainer = styled.div`
    display: flex;
    flex-direction: column;
`
const SearchTitle = styled.a`
    margin: 5px;
`