import React from 'react';
import { Link } from 'react-router-dom';

type product = {
    category: string;
    price: string;
    stocked: boolean;
    name: string;
  }
  
  function ProductTable({ products } : { products: product[] }) {
    const rows: JSX.Element[] = [];
    products.forEach(el => {
      rows.push(
        <tr>
          <td>{el.name}</td>
          <td>{el.price}</td>
        </tr>
      )
    });
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody className="text-0xl font-medium pt-1">{rows}</tbody>
      </table>
    );
  }
  

const PRODUCTS = [
    {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
    {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
    {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
    {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
    {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
    {category: "Vegetables", price: "$1", stocked: true, name: "Peas"},
    {category: "Vegetables", price: "$1", stocked: true, name: "Peas1"},
    {category: "Vegetables", price: "$1", stocked: true, name: "Peas2"},
    {category: "Vegetables", price: "$1", stocked: true, name: "Peas3"}
  ];

const Grapgh: React.FC = () => {
  return (
    <div className="">
		<p>履歴</p>
        <ProductTable products={PRODUCTS} />
    </div>
  );
};

export default Grapgh;