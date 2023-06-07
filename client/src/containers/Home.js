import React, { useEffect, useState } from "react";
import {
  EyeOutlined,
  ShoppingCartOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Carousel, Row, Col, Card, Space, Typography, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import useProducts from "../_actions/productAction";
import bannerOne from "../assets/images/bannerOne.jpg";
import bannerTwo from "../assets/images/bannerTwo.jpg";
import bannerThree from "../assets/images/bannerThree.jpg";
import ProductDetailsModal from "../components/Modals/ProductDetailsModal";
import ProductFilters from "../components/Filters/ProductFilters";
import useCarts from "../_actions/cartActions";

const contentStyle = {
  width: "100%",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

const { Text } = Typography;

const initialQuery = {
  skip: 0,
  filters: { price: { $gte: 4, $lte: 20 } },
};

function Home() {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.product.productList);
  const { getProductList } = useProducts();
  const { addToCart } = useCarts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState(initialQuery);

  const handleShowProductDetails = (item) => {
    setSelectedProduct(item);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleLoadMore = () => {
    const newQuery = {
      ...query,
      skip: query.skip + 4,
      loadMore: true,
    };
    setQuery(newQuery);
    getProductList(newQuery);
  };

  const handleSearchProduct = (filters) => {
    const newQuery = {
      skip: 0,
      filters,
    };
    setQuery(newQuery);
    getProductList(newQuery);
  };

  const handleClearSearchProduct = () => {
    setQuery(initialQuery);
    getProductList(initialQuery);
  };

  const handleAddToCart = (item) => {
    const data = {
      _productId: item._id,
      quantity: 1,
    };
    dispatch(addToCart(data)).then((res) => {
      if (res.payload.status) {
        message.success(res.payload.message);
      } else {
        message.error(res.payload.message);
      }
    });
  };

  useEffect(() => {
    getProductList(query);
  }, []);

  const renderFilters = () => {
    return (
      <ProductFilters
        onSearch={handleSearchProduct}
        onClear={handleClearSearchProduct}
        initialFilters={initialQuery.filters}
      />
    );
  };

  const renderSlider = () => {
    return (
      <Carousel autoplay>
        <div>
          <img src={bannerOne} style={contentStyle} />
        </div>
        <div>
          <img src={bannerTwo} style={contentStyle} />
        </div>
        <div>
          <img src={bannerThree} style={contentStyle} />
        </div>
      </Carousel>
    );
  };

  const renderProductList = () => {
    return (
      <Row gutter={[12, 12]} style={{ padding: 10 }}>
        {productList?.map((item, index) => {
          return (
            <Col key={index} xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
              <Card
                hoverable
                cover={<img alt="product" src={item.image} />}
                actions={[
                  <EyeOutlined
                    key="view"
                    style={{ color: "orange", fontSize: 15 }}
                    onClick={() => handleShowProductDetails(item)}
                  />,
                  <ShoppingCartOutlined
                    key="cart"
                    style={{ color: "#b82837", fontSize: 15 }}
                    onClick={() => handleAddToCart(item)}
                  />,
                ]}
              >
                <Space direction="vertical">
                  <Text strong onClick={() => handleShowProductDetails(item)}>
                    {item.name}
                  </Text>
                  <Text type="secondary">{item._category?.name}</Text>
                  <Text type="success">${item.price}</Text>
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };

  return (
    <>
      {renderSlider()}
      {renderFilters()}
      {renderProductList()}
      <div className="product-load-more">
        {query?.skip <= productList?.length ? (
          <>
            <DownOutlined onClick={handleLoadMore} />
            <p>Load More</p>
          </>
        ) : (
          <p>No more product</p>
        )}
      </div>
      <ProductDetailsModal
        visible={showModal}
        product={selectedProduct}
        onCancel={handleCancel}
      />
    </>
  );
}

export default Home;
