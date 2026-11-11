import { type ChangeEvent, type SubmitEvent, useState } from "react";
import styled from "styled-components";

type T = {
    type: string;
    title: string;
    amount: number;
};
const Container = styled.div`
    width: 100%;
    max-width: 720px;
    padding: 0 16px;
    color: #1f2937;
`;

const Title = styled.h1`
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 20px;
`;

const Fieldset = styled.fieldset`
    border: 1px solid #d1d5db;
    border-radius: 10px;
    padding: 16px;
    background-color: white;
`;

const Legend = styled.legend`
    padding: 0 8px;
    font-size: 14px;
    font-weight: 600;
    color: #4b5563;
`;

const Form = styled.form`
    display: flex;
    gap: 8px;
`;

const Select = styled.select`
    height: 40px;
    padding: 0 12px;
    font-size: 15px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background-color: white;
    &:hover {
        outline: 2px solid #2563ed;
        border-color: #2563ed;
    }
`;
const Input = styled.input`
    height: 40px;
    padding: 0 12px;
    font-size: 15px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background-color: white;
    flex: 1;
    min-width: 0;
    &:hover {
        outline: 2px solid #2563ed;
        border-color: #2563ed;
    }
    &:focus {
        outline: 2px solid #2563ed;
        border-color: #2563ed;
    }
`;
const AmountInput = styled.input`
    height: 40px;
    padding: 0 12px;
    font-size: 15px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background-color: white;
    width: 120px;
    &:hover {
        outline: 2px solid #2563ed;
        border-color: #2563ed;
    }
    &:focus {
        outline: 2px solid #2563ed;
        border-color: #2563ed;
    }
`;

const AddButton = styled.button`
    height: 40px;
    padding: 0 20px;
    font-size: 15px;
    font-weight: 600;
    color: white;
    background-color: #2563ed;
    border: none;
    border-radius: 6px;
    cursor: pointer;
`;

const Table = styled.table`
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
    background-color: white;
    border: 1px solid #d1d5db;
    th,
    td {
        padding: 12px;
        text-align: center;
        border-bottom: 1px solid #e5e7eb;
    }

    thead {
        background-color: #f3f4f6;
    }
    th {
        font-size: 14px;
        font-weight: 600;
        color: #4b5566;
    }
    tbody tr:hover {
        background-color: #f9fafb;
    }
`;

const DeleteButton = styled.button`
    padding: 6px 12px;
    font-size: 13px;
    color: #dc2626;
    background-color: white;
    border: 1px solid #fca5a5;
    border-radius: 6px;
    cursor: pointer;
`;

const Summary = styled.div`
    margin-top: 20px;
    padding: 16px;
    border-radius: 10px;
    background-color: #f3f4f6;
`;

const SummaryText = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: #4b5566;
`;

const Balance = styled.span`
    margin-top: 8px;
    font-size: 22px;
    font-weight: 700;
    color: #111827;
`;

const Amount = styled.td<{ type: string }>`
    color: ${props => (props.type === "income" ? "#2563ed" : "#dc2626")};
    font-weight: 600;
`;

function App() {
    const [type, setType] = useState<string>("expense");
    const [title, setTitle] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [list, setList] = useState<T[]>([]);

    const handleChangeTitle = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const handleChangeAmount = (event: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        setAmount(event.target.value);
    };

    const handleChangeType = (event: ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => {
        setType(event.target.value);
    };

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const parseAmount = Number(amount);
        const parseTitle = title.trim();

        if (parseAmount <= 0 || parseTitle === "") {
            return;
        }

        const newRecord = {
            type: type,
            title: title,
            amount: parseAmount,
        };
        setList([...list, newRecord]);

        setType("expense");
        setTitle("");
        setAmount("");
    };

    const handleDelete = (index: number) => {
        const newList = list.filter((_, i) => i !== index);
        setList(newList);
    };

    const totalIncome = list.reduce((sum, item) => {
        return item.type === "income" ? sum + item.amount : sum;
    }, 0);
    const totalExpense = list.reduce((sum, item) => {
        return item.type === "expense" ? sum + item.amount : sum;
    }, 0);
    const balance = totalIncome - totalExpense;

    return (
        <>
            <Container>
                <Title>간단 가계부</Title>
                <Fieldset>
                    <Legend>내역 추가</Legend>
                    <Form onSubmit={handleSubmit}>
                        <Select onChange={handleChangeType} value={type}>
                            <option value={"expense"}>지출</option>
                            <option value={"income"}>수입</option>
                        </Select>
                        <Input
                            placeholder={"내용 (예 : 점심, 월급)"}
                            onChange={handleChangeTitle}
                            value={title}
                        />
                        <AmountInput
                            placeholder={"금액"}
                            type={"number"}
                            min={0}
                            onChange={handleChangeAmount}
                            value={amount}
                        />
                        <AddButton type={"submit"}>추가</AddButton>
                    </Form>
                </Fieldset>
                <Table>
                    <thead>
                        <tr>
                            <th>구분</th>
                            <th>내용</th>
                            <th>금액</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/*조건부 렌더링: list 요소가 없으면 안내 문구를 보여주도록*/}
                        {list.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ textAlign: "center" }}>
                                    등록된 내역이 없습니다.
                                </td>
                            </tr>
                        )}
                        {list.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.type === "income" ? "수입" : "지출"}</td>
                                    <td>{item.title}</td>
                                    <Amount type={item.type}>
                                        {item.type === "income" ? "+" : "-"}
                                        {item.amount.toLocaleString()}
                                    </Amount>
                                    <td>
                                        <DeleteButton
                                            onClick={() => {
                                                // 해야되는 일
                                                // list에서 index번호의 요소를 삭제
                                                handleDelete(index);
                                            }}>
                                            삭제
                                        </DeleteButton>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>

                <Summary>
                    <SummaryText>
                        수입 : {totalIncome.toLocaleString()}원 / 지출 :{" "}
                        {totalExpense.toLocaleString()}원
                    </SummaryText>
                    <Balance
                        style={{
                            color: balance >= 0 ? "blue" : "red",
                        }}>
                        잔액 : {balance.toLocaleString()}원
                    </Balance>
                </Summary>
            </Container>
        </>
    );
}

export default App;
