import React from "react";
import { Route, Switch } from "react-router-dom";
import ProductListPage from "./ProductList";
import CreateProduct from "./CreateProduct";
import DetailProductPage from "./DetailProduct";

export default function ProductsPage() {
  return (
    <Switch>
      <Route exact path="/products" component={ProductListPage} />
      <Route exact path="/products/add" component={CreateProduct} />
      <Route path="/products/:id" component={DetailProductPage} />
    </Switch>
  );
}
