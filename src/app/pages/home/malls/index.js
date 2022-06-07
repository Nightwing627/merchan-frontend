import React from "react";
import { Route, Switch } from "react-router-dom";
import ShoppingListPage from "./ShoppingList";
import CreateShoppingPage from "./CreateShoppingPage";
import EditMallPage from "./EditMall";
export default function UsersPage() {
  return (
    <Switch>
      <Route exact path="/malls" component={ShoppingListPage} />
      <Route exact path="/malls/add" component={CreateShoppingPage} />
      <Route path="/malls/:id" component={EditMallPage} />
    </Switch>
  );
}
