import React from "react";
import { Route, Switch} from "react-router-dom";
import UserListPage from "./UserListPage";
import EditUserPage from "./EditUserPage";
import CreateUserPage from "./CreateUserPage";

export default function UsersPage() {
  return (
    <Switch>
      <Route exact path="/users" component={UserListPage} />
      <Route exact path="/users/add" component={CreateUserPage} />
      <Route path="/users/:id" component={EditUserPage} />
    </Switch>
  );
}
