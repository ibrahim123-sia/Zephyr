import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser, deleteUser, fetchUsers, updateUser } from "../../redux/slices/adminSlice";

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { users, loading, error } = useSelector((state) => state.admin);

  const formWrapper = "bg-white p-6 rounded-sm border border-zephyr-sand mb-8";
  const inputClass = "w-full p-3 border border-zephyr-sand rounded-sm focus:outline-none focus:ring-1 focus:ring-zephyr-gold focus:border-zephyr-gold transition duration-200 bg-zephyr-ivory";
  const buttonPrimary = "bg-zephyr-noir hover:bg-zephyr-gold text-zephyr-ivory p-3 rounded-sm font-medium uppercase text-sm tracking-widest transition duration-200";
  const buttonDanger = "border border-red-300 text-red-600 hover:bg-red-50 px-4 py-2 rounded-sm font-medium transition duration-200 text-sm";
  const labelClass = "block text-sm font-medium mb-2 text-zephyr-umber";

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(fetchUsers());
    }
  }, [dispatch, user]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addUser(formData));
    setFormData({ name: "", email: "", password: "", role: "customer" });
  };

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUser({ id: userId, role: newRole }));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zephyr-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-sm text-red-700">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="font-display text-2xl text-zephyr-noir mb-6">User Management</h2>

      <div className={formWrapper}>
        <h3 className="text-lg font-bold mb-4 text-zephyr-umber">Add New User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} required />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputClass} required />
          </div>

          <div>
            <label className={labelClass}>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className={inputClass}>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className={buttonPrimary}>
            Add User
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-sm border border-zephyr-sand bg-white">
        <table className="min-w-full divide-y divide-zephyr-sand">
          <thead className="bg-zephyr-noir">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zephyr-ivory uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zephyr-ivory uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zephyr-ivory uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zephyr-ivory uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-zephyr-sand">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-zephyr-ivory transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zephyr-noir">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zephyr-umber/70">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="bg-zephyr-ivory border border-zephyr-sand text-zephyr-umber text-sm rounded-sm focus:ring-zephyr-gold focus:border-zephyr-gold block p-2"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleDeleteUser(user._id)} className={buttonDanger}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
