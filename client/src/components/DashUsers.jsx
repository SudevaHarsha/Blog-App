import { Modal, Table, Button, Alert, Label, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [makePublisher, setMakePublisher] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const res2 = await fetch(`/api/user/getOnlyUsers`);
        const data = await res.json();
        const data2 = await res2.json();
        if (res.ok) {
          if (currentUser.role === "editor") {
            setUsers(data2)
          } else {
            setUsers(data.users);
          }
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.role === "admin" || currentUser.role === "editor") {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCreateUser = async () => {
    try {
      const res = await fetch(`/api/user/createnewuser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [data, ...prev]); // Add new user to the list
        setShowCreateModal(false); // Close modal
        setNewUser({ username: '', email: '', password: '', role: 'user' }); // Reset form
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handlemakePublisher = async (id,role) => {
    const res = await fetch(`/api/user/makepublisher/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    });
    setUsers((prev) =>
      prev.map((user) =>
        user._id === id ? { ...user, role: role } : user
      )
    );
    setMakePublisher(`Changed role to ${role} Successfully`);
  }

  const handleRoleChange = async (id, role) => {
    try {
      if (role === 'admin') {
        setMakePublisher('Only one admin can exists')
      }
      const res = await fetch(`/api/user/changeuserrole/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, role } : user
          )
        );
        setMakePublisher('Role updated successfully!');
        setTimeout(() => setMakePublisher(''), 3000); // Clear success message after 3 seconds
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {["admin", "editor"].includes(currentUser.role) && users.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>{currentUser.role === "admin" ? "Admin" : "Publisher"}</Table.HeadCell>
              <Table.HeadCell>{currentUser.role === "admin" ? "Delete" : "ChangeRole"}</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className='divide-y' key={user._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  {currentUser.role === "admin" && (<Table.Cell>
                    {currentUser.role === "admin" && (
                      user.role === "admin" ? (
                        // Display a non-editable role label for Admin
                        <span className="text-gray-500 dark:text-gray-300">Admin</span>
                      ) : (
                        // Editable select dropdown for other roles
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="bg-transparent border border-gray-300 text-gray-900 dark:text-gray-100 dark:border-gray-700 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500"
                        >
                          <option value="user" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">User</option>
                          <option value="publisher" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Publisher</option>
                          <option value="editor" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Editor</option>
                        </select>
                      )
                    )}
                  </Table.Cell>)}
                  {currentUser.role === "editor" && (<Table.Cell>
                    {user.role === "publisher" ? (
                      <FaCheck className='text-green-500' />
                    ) : (
                      <FaTimes className='text-red-500' />
                    )}
                  </Table.Cell>)}
                  {currentUser.role === "admin" && <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </Table.Cell>}
                  {currentUser.role === "editor" && (
                    <Table.Cell>
                      {user.role === "publisher" ? (
                        <span
                          onClick={() => handleRoleChange(user._id, 'user')}
                          className="font-medium text-red-500 hover:underline cursor-pointer"
                        >
                          Demote to User
                        </span>
                      ) : (
                        <span
                          onClick={() => handlemakePublisher(user._id, 'publisher')}
                          className="font-medium text-green-500 hover:underline cursor-pointer"
                        >
                          Make Publisher
                        </span>
                      )}
                    </Table.Cell>
                  )}
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no users yet!</p>
      )
      }
      {
        makePublisher && (
          <Alert color='success' className='mt-5'>
            {makePublisher}
          </Alert>
        )
      }
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this user?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <Modal.Header>Create New User</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username" value="Username" />
              <TextInput
                id="username"
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" value="Email" />
              <TextInput
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Enter email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" value="Password" />
              <TextInput
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Enter password"
                required
              />
            </div>
            <div>
              <Label htmlFor="role" value="Role" />
              <select
                id="role"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
              >
                <option value="user">User</option>
                <option value="publisher">Publisher</option>
                <option value="editor">Editor</option>
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="teal" onClick={handleCreateUser}>
            Create
          </Button>
          <Button color="gray" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      {currentUser.role === "admin" && <Button color="teal" className='mt-2' onClick={() => setShowCreateModal(true)}>
        Create User
      </Button>}
    </div >
  );
}
