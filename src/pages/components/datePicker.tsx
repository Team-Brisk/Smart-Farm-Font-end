// src/components/DatePickers.tsx
import React, { useState } from 'react';
import { Card, Space, Typography, Divider, DatePicker, Select, TimePicker } from 'antd';
import type { DatePickerProps, TimePickerProps, GetProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

type PickerType = 'time' | 'date';
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

interface PickerWithTypeProps {
  type: PickerType;
  onChange: TimePickerProps['onChange'] | DatePickerProps<Dayjs>['onChange'];
}

const { RangePicker } = DatePicker;
const { Title } = Typography;

const PickerWithType: React.FC<PickerWithTypeProps> = ({ type, onChange }) => {
  if (type === 'time') {
    return <TimePicker onChange={onChange} />;
  }
  if (type === 'date') {
    return <DatePicker onChange={onChange} />;
  }
  return <DatePicker picker={type} onChange={onChange} />;
};

const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
  console.log('onOk: ', value);
};

// --------------------------- //
// Common Format
// --------------------------- //
export const dateFormat = 'YYYY/MM/DD';
export const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];
export const weekFormat = 'MM/DD';
export const monthFormat = 'YYYY/MM';

// --------------------------- //
// 1. Basic Date Picker
// --------------------------- //
export const BasicDatePicker: React.FC = () => (
  <DatePicker defaultValue={dayjs('2015/01/01', dateFormat)} format={dateFormat} />
);

// --------------------------- //
// 2. DatePicker with Multiple Accepted Formats
// --------------------------- //
export const ListFormatDatePicker: React.FC = () => (
  <DatePicker defaultValue={dayjs('01/01/2015', dateFormatList[0])} format={dateFormatList} />
);

// --------------------------- //
// 3. Month Picker
// --------------------------- //
export const MonthPicker: React.FC = () => (
  <DatePicker defaultValue={dayjs('2015/01', monthFormat)} format={monthFormat} picker="month" />
);

// --------------------------- //
// 4. Week Picker (Custom Display Format)
// --------------------------- //
export const WeekPickerCustom: React.FC = () => {
  const customWeekFormat: DatePickerProps['format'] = value =>
    `${dayjs(value).startOf('week').format(weekFormat)} ~ 
     ${dayjs(value).endOf('week').format(weekFormat)}`;

  return <DatePicker defaultValue={dayjs()} format={customWeekFormat} picker="week" />;
};

// --------------------------- //
// 5. Range Picker
// --------------------------- //
export const BasicRangePicker: React.FC = () => (
  <RangePicker defaultValue={[dayjs('2015/01/01', dateFormat), dayjs('2015/01/01', dateFormat)]} format={dateFormat} />
);

// --------------------------- //
// 6. Custom Format Date Picker
// --------------------------- //
export const CustomFormatDatePicker: React.FC = () => {
  const customFormat: DatePickerProps['format'] = value => `custom format: ${value.format(dateFormat)}`;

  return <DatePicker defaultValue={dayjs('2015/01/01', dateFormat)} format={customFormat} />;
};

export const SwitchablePicker: React.FC = () => {
  const [type, setType] = useState<PickerType>('time');

  return (
    <Space>
      <Select
        aria-label="Picker Type"
        value={type}
        onChange={setType}
        options={[
          { label: 'Time', value: 'time' },
          { label: 'Date', value: 'date' },
          { label: 'Week', value: 'week' },
          { label: 'Month', value: 'month' },
          { label: 'Quarter', value: 'quarter' },
          { label: 'Year', value: 'year' },
        ]}
      />
      <PickerWithType type={type} onChange={value => console.log(value)} />
    </Space>
  );
};

export const SchooseTime: React.FC = () => (
  <Space vertical size={12}>
    {/* <DatePicker
      showTime
      onChange={(value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
      }}
      onOk={onOk}
    /> */}
    <RangePicker
      showTime={{ format: 'HH:mm' }}
      format="YYYY-MM-DD HH:mm"
      onChange={(value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
      }}
      onOk={onOk}
    />
  </Space>
);

const DatePickerPage: React.FC = () => {
  return (
    <div className="p-6">
      <Title level={3}>DatePicker Components</Title>
      <Divider />
      <Card className="p-4">
        {/* <Card className="shadow-sm rounded-2xl p-4"> */}
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <BasicDatePicker />
          <ListFormatDatePicker />
          <MonthPicker />
          <WeekPickerCustom />
          <BasicRangePicker />
          <CustomFormatDatePicker />
          <SwitchablePicker />
          <SchooseTime />
        </Space>
        {/* </Card> */}
      </Card>
    </div>
  );
};

export default DatePickerPage;
