import React from 'react';
import styled from '@emotion/styled';
import { BlockProps } from '../../types';
import { useApp } from '../../context/AppContext';

const ProductContainer = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  max-width: 320px;
  margin: 0 auto;
`;

const ProductImage = styled.img`
  width: 100%;
  max-width: 200px;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const ProductTitle = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ProductPrice = styled.div`
  color: #3b82f6;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ProductButton = styled.button`
  padding: 0.5rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #2563eb;
  }
`;

const ProductInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

interface ProductData {
  image: string;
  title: string;
  price: string;
  button: string;
}

const ProductBlock: React.FC<BlockProps> = ({ id, content, onUpdate }) => {
  const { state } = useApp();
  const isPreview = state.previewMode;
  const data: ProductData = content ? JSON.parse(content) : { image: '', title: '', price: '', button: '' };

  const handleChange = (field: keyof ProductData, value: string) => {
    const newData = { ...data, [field]: value };
    onUpdate(id, JSON.stringify(newData));
  };

  if (isPreview) {
    return (
      <ProductContainer>
        {data.image && <ProductImage src={data.image} alt={data.title} />}
        <ProductTitle>{data.title || 'Product Title'}</ProductTitle>
        <ProductPrice>{data.price ? `$${data.price}` : ''}</ProductPrice>
        <ProductButton>{data.button || 'Buy Now'}</ProductButton>
      </ProductContainer>
    );
  }

  return (
    <ProductContainer>
      <ProductInput
        type="text"
        value={data.image}
        onChange={e => handleChange('image', e.target.value)}
        placeholder="Image URL"
      />
      <ProductInput
        type="text"
        value={data.title}
        onChange={e => handleChange('title', e.target.value)}
        placeholder="Product Title"
      />
      <ProductInput
        type="text"
        value={data.price}
        onChange={e => handleChange('price', e.target.value)}
        placeholder="Price"
      />
      <ProductInput
        type="text"
        value={data.button}
        onChange={e => handleChange('button', e.target.value)}
        placeholder="Button Text"
      />
      {data.image && <ProductImage src={data.image} alt={data.title} />}
    </ProductContainer>
  );
};

export default ProductBlock; 