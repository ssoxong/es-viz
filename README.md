# ElasticSearch에 프론트엔드 연동

## INDEX TABLE 페이지

![image 3](https://github.com/user-attachments/assets/bd1012a1-b6ad-495d-946f-72fe1d3a19c4)


- INDEX TABLE (인덱스 숫자)를 통해 인덱스 수 한 눈에 확인 가능
- 인덱스별 status, doc count, size 확인 가능
- 왼쪽 check형태의 버튼과 하단의 Delete 버튼을 통해 여러 인덱스 삭제 가능
![image 4](https://github.com/user-attachments/assets/c3970aea-eadb-40e3-be31-6686d6ea810a)

- NEW INDEX 버튼을 누르면 인덱스를 추가할 수 있는 모달 팝업
- 인덱스 이름과 샤드, 복제 수를 지정할 수 있고 샤드와 복제 수의 기본 값은 1

## INDEX 내의 도큐먼트 페이지

![image 5](https://github.com/user-attachments/assets/c39421e1-0866-4f8f-905a-f36a761be468)

- Index Table에서 특정 인덱스(goods)를 클릭하면 인덱스 안의 도큐먼트에 대한 정보 출력
- 왼쪽 check형태의 버튼과 하단의 Delete 버튼을 통해 여러 도큐먼트 삭제 가능
- index pattern, search 기능을 통해 Elasticvue와 동일한 형태로 쿼리 가능

![image 6](https://github.com/user-attachments/assets/b4129347-b64e-4dc9-8b48-d5d5d12b2617)

- Actions-Edit을 통해 도큐먼트를 수정할 수 있는 모달 팝업

![image 7](https://github.com/user-attachments/assets/7684a54a-48ef-475d-bfa7-a11b607ce884)

- ADD DOCUMENT 버튼으로 데이터 삽입
    
    이미 존재하는 칼럼 기반으로 삽입하는 것이 아닌 key-value 형태로 삽입할 수 있게 하였다.
    

## 검색 기능

INDEX 내의 도큐먼트 페이지에서 elasticsearch처럼 검색할 수 있는 기능을 구현하였다.

기본값은 index와 *로, 특정 index의 전체 데이터(*)를 출력한다.

### 필드 검색

![image 8](https://github.com/user-attachments/assets/66ff0354-6d62-4a57-9e44-16e2f1a99820)

price 필드의 비교연산을 통해 조건에 부합하는 도큐먼트만 출력된다.

![image 9](https://github.com/user-attachments/assets/1fe9c193-10c0-4f1d-8ac6-d8bb00e528b9)


와일드카드를 사용하여 검색할 수 있다.

### 인덱스 패턴 검색
![image 10](https://github.com/user-attachments/assets/e9ea05e3-3f90-4d26-a3cc-6ce5c5a904e6)


index pattern을 사용하여 여러 인덱스를 한꺼번에 검색할 수 있다.

`p*` index pattern을 사용했기 때문에 phones, products 인덱스의 도큐먼트 중 price 조건에 맞는 도큐먼트들이 출력된다.
