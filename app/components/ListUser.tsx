import React from 'react';
import { Customer } from '../page';
import clsxm from '@/lib/clsxm';

type ListUserProps = {
  userSelected: Customer | null;
  onSelectUser?: (user: Customer) => void;
};
export default function ListUser(props: ListUserProps) {
  const { userSelected, onSelectUser } = props;

  const Customers: Customer[] = [
    { id: 1, name: 'Nguyễn Văn A', birthday: '1990-01-01', gender: 'Nam' },
    { id: 2, name: 'Trần Thị B', birthday: '1992-05-12', gender: 'Nữ' },
    { id: 3, name: 'Lê Văn C', birthday: '1985-09-20', gender: 'Nam' },
  ];

  return (
    <div className="w-full flex flex-col gap-[8px]">
      {!!userSelected?.name && (
        <p className="text-sm text-gray-600 text-[20px]">
          Đang chọn: {userSelected?.name}
        </p>
      )}
      <p>Danh sách bệnh nhân:</p>
      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Tên</th>
            <th className="border p-2">Ngày sinh</th>
            <th className="border p-2">Giới tính</th>
            <th className="border p-2 text-center">Chọn</th>
          </tr>
        </thead>
        <tbody>
          {Customers.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.birthday}</td>
              <td className="border p-2">{c.gender}</td>
              <td className="border p-2 text-center">
                <button
                  className={clsxm(
                    'px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer',

                    c.id === userSelected?.id &&
                      ' bg-[#d9d9d9] hover:bg-[#d9d9d9] pointer-events-none',
                  )}
                  onClick={() => {
                    if (c.id === userSelected?.id) {
                      return;
                    }
                    onSelectUser?.(c);
                  }}
                >
                  Chọn
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
