<<<<<<< HEAD
import { useEffect, useState } from "react";
import { UserPreview } from "./UserPreview";
import { useSelector } from "react-redux";
=======
import { useEffect, useState } from "react"
import { UserPreview } from "./UserPreview"
import { useSelector } from "react-redux"
>>>>>>> 49399a8864d22b6ace0bf34734fc436a6e6be419

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
<<<<<<< HEAD
        user._id !== loggedInUser?._id &&
        (regexPattern.test(user.fullName) ||
          user.msgs.some((msg) => regexPattern.test(msg.content)))
      );
    });
  };

=======
        regexPattern.test(user.fullName) ||
        user.msgs.some((msg) => regexPattern.test(msg.content))
      )
    })
  }
>>>>>>> 49399a8864d22b6ace0bf34734fc436a6e6be419
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
