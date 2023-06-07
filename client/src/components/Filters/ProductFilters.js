import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Input,
  InputNumber,
  Slider,
  Typography,
  Select,
} from "antd";
import { CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import useProducts from "../../_actions/productAction";

const { Text } = Typography;

const ProductFilters = (props) => {
  const { initialFilters, onSearch, onClear } = props;
  const [filters, setFilters] = useState(initialFilters);
  const [keyword, setKeyword] = useState();
  const { getCategoryList } = useProducts();
  const categoryList = useSelector((state) => state.product.categoryList);

  const handleKeywordChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    setFilters({
      ...filters,
      name: { $regex: value, $options: "i" },
    });
  };

  const handleSelectCategory = (value) => {
    setFilters({
      ...filters,
      _category: value,
    });
  };

  const handlePriceFromChange = (value) => {
    const price = { ...filters.price };
    price.$gte = value;
    setFilters({
      ...filters,
      price,
    });
  };

  const handlePriceToChange = (value) => {
    const price = { ...filters.price };
    price.$lte = value;
    setFilters({
      ...filters,
      price,
    });
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClearSearch = () => {
    setKeyword(null);
    setFilters(initialFilters);
    onClear();
  };

  useEffect(() => {
    getCategoryList();
  }, [getCategoryList]);

  return (
    <Row gutter={[8, 8]} style={{ padding: 10 }} align="middle">
      <Col xs={24} sm={12} md={12} lg={6} xl={3} xxl={3}>
        <Input
          placeholder="Enter keyword..."
          value={keyword}
          onChange={handleKeywordChange}
        />
      </Col>

      <Col xs={24} sm={12} md={12} lg={6} xl={3} xxl={3}>
        <Select
          placeholder="Select categories"
          style={{ width: "100%" }}
          value={filters._category}
          onChange={handleSelectCategory}
        >
          {categoryList?.map((category) => (
            <Select.Option value={category._id}>{category.name}</Select.Option>
          ))}
        </Select>
      </Col>

      <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
        <Row gutter={4} align="middle">
          <Col span={5}>
            <Text>Price From</Text>
          </Col>
          <Col span={10}>
            <Slider
              min={1}
              max={20}
              value={filters.price.$gte}
              onChange={handlePriceFromChange}
            />
          </Col>
          <Col span={4}>
            <InputNumber
              min={1}
              max={20}
              value={filters.price.$gte}
              onChange={handlePriceFromChange}
            />
          </Col>
        </Row>
      </Col>

      <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
        <Row gutter={4} align="middle">
          <Col span={5}>
            <Text>Price To</Text>
          </Col>
          <Col span={10}>
            <Slider
              min={1}
              max={20}
              value={filters.price.$lte}
              onChange={handlePriceToChange}
            />
          </Col>
          <Col span={4}>
            <InputNumber
              min={1}
              max={20}
              value={filters.price.$lte}
              onChange={handlePriceToChange}
            />
          </Col>
        </Row>
      </Col>

      <Col xs={24} sm={12} md={12} lg={6} xl={6} xxl={6}>
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
          style={{ marginRight: 10, marginLeft: 10 }}
        >
          Search
        </Button>
        <Button
          type="default"
          icon={<CloseCircleOutlined />}
          onClick={handleClearSearch}
        >
          Clear
        </Button>
      </Col>
    </Row>
  );
};

export default ProductFilters;
