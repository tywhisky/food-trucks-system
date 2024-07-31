import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType, TableColumnType, TableProps } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import TrucksMap from './Map';

interface DataType {
  latitude: number;
  longitude: any;
  locationId: Number;
  applicant: string;
  facilityType: string;
  locationDescription: string;
  address: string;
  status: string;
  foodItems: string;
}

type DataIndex = keyof DataType;

const TrucksTable: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const [postion, setPosition] = useState({ lat: -25.344, lng: 131.036 })

  useEffect(() => {
    axios.get(`/trucks?take=${500}&skip=${0}`)
      .then((res) => {
        setLoading(false)
        setData(res.data.list)
      })
  }, []);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const tableProps: TableProps<DataType> = { loading };
  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Location ID',
      dataIndex: 'locationId',
      key: 'locationId',
      ...getColumnSearchProps("locationId"),
    },
    {
      title: 'Applicant',
      dataIndex: 'applicant',
      key: 'applicant',
      ...getColumnSearchProps('applicant'),
    },
    {
      title: 'Facility Type',
      dataIndex: 'facilityType',
      key: 'facilityType',
      ...getColumnSearchProps('facilityType'),
    },
    {
      title: 'Location Description',
      dataIndex: 'locationDescription',
      key: 'locationDescriptio',
      ...getColumnSearchProps('locationDescription'),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ...getColumnSearchProps('address'),
      sorter: (a, b) => a.address.length - b.address.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status'),
    },
    {
      title: 'Food Items',
      dataIndex: 'foodItems',
      key: 'foodItems',
      ...getColumnSearchProps('foodItems'),
    },
    {
      title: 'Action',
      render: (_, record) => (<Button type="primary" icon={<SearchOutlined />} iconPosition="start" onClick={(_e) => findInMap(record)}>
        Find in Map
      </Button>)
    }
  ];

  const findInMap = (record: DataType) => {
    setPosition({ lat: Number(record.latitude), lng: Number(record.longitude) })
  }

  return (
    <div>
      <div className='h-96 py-4'>
        <TrucksMap position={postion}/>
      </div>
      <Table rowKey={(record) => Number(record.locationId)} {...tableProps} scroll={{ y: 500 }} columns={columns} dataSource={data} >
      </Table>
    </div>
  )
};

export default TrucksTable;
