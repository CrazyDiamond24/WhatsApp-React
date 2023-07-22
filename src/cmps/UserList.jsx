import { useEffect, useState } from "react";
import { UserPreview } from "./UserPreview";
import { useSelector } from "react-redux";

export function UserList({ filterBy, onRemoveUser, onSelectContact }) {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const users = useSelector((storeState) => storeState.userModule.users);
  const loggedInUser = useSelector((storeState) => {
    return storeState.userModule.loggedInUser;
  });

  useEffect(() => {
    const filteredUsers = filterUsers(users, filterBy);
    setFilteredUsers(filteredUsers);
  }, [filterBy, users]);

  const filterUsers = (users, filterBy) => {
    const regexPattern = new RegExp(filterBy, "i");
    return users?.filter((user) => {
      return (
        user._id !== loggedInUser?._id &&
        (regexPattern.test(user.fullName) ||
          user.msgs.some((msg) => regexPattern.test(msg.content)))
      );
    });
  };

  return (
    <section className="user-list simple-cards-grid">
      {filteredUsers?.map((user) => (
        <UserPreview
          key={user._id}
          user={user}
          onRemoveUser={onRemoveUser}
          onSelectContact={() => onSelectContact(user._id)}
        />
      ))}
    </section>
  );
}
