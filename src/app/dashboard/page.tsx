"use client";

import { useState, useEffect } from "react";
import { User, ChevronDown, Edit, Trash, Plus, X } from "lucide-react";
import { authenticationService } from "@/services/authentication.service";
import { IUser } from "@/interfaces/user.interface";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<IUser>();
  const router = useRouter();

  const fetchUserDetails = async () => {
    try {
      const response = await authenticationService.userDetails();
      return response;
    } catch (error) {
      console.error("Error fetching user details:", (error as Error).message);
      return false;
    }
  };
  const fetchLogOut = async () => {
    try {
      const response = await authenticationService.logOut();
      return response;
    } catch (error) {
      console.error("Error logging out:", (error as Error).message);
      return false;
    }
  };

  useEffect(() => {
    const getUserDetails = async () => {
      const userDetails = await fetchUserDetails();
      if (userDetails) {
        console.log("User details:", userDetails);
        setUser(userDetails);
      }
    };

    setUsers([
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        phone: "123456789",
        email: "john@example.com",
        password: "********",
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        phone: "987654321",
        email: "jane@example.com",
        password: "********",
      },
    ]);

    getUserDetails();
  }, []);

  const openModal = (mode: "create" | "edit", user?: User) => {
    setMode(mode);
    setCurrentUser(
      user || {
        id: 0,
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
      }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const saveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      if (mode === "create") {
        setUsers([...users, { ...currentUser, id: users.length + 1 }]);
      } else {
        setUsers(users.map((u) => (u.id === currentUser.id ? currentUser : u)));
      }
    }
    closeModal();
  };

  const deleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  const handleLogOut = async () => {
    const logOut = await fetchLogOut();

    if (logOut) {
      Cookies.remove("token");
      console.log(logOut);
      router.push("/login");
    }

    console.log("Se cerró la sesión");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-semibold text-gray-800">
              Panel administrativo
            </h1>
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
              >
                <User className="h-4 w-4" />
                <span> {user?.first_name} </span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-sm text-gray-500"> {user?.email} </p>
                    </div>
                    <button
                      onClick={handleLogOut}
                      className="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 transition duration-150 ease-in-out text-red-500"
                      role="menuitem"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                        />
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-6 flex justify-between items-center border-b">
            <h2 className="text-xl font-semibold text-gray-800">Usuarios</h2>
            <button
              onClick={() => openModal("create")}
              className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md flex items-center transition duration-150 ease-in-out"
            >
              <Plus className="h-5 w-5 mr-2" />
              Agregar usuario
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nombres
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Apellidos
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Número de teléfono
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Correo electrónico
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.firstName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openModal("edit", user)}
                        className="text-teal-600 hover:text-teal-900 mr-3 transition duration-150 ease-in-out"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        {isModalOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
            id="my-modal"
          >
            <div className="relative bg-white w-full max-w-md mx-auto rounded-lg shadow-lg">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {mode === "create" ? "Add User" : "Edit User"}
                </h3>
                <form onSubmit={saveUser} className="space-y-4">
                  <input
                    className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    type="text"
                    placeholder="First Name"
                    value={currentUser?.firstName || ""}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser!,
                        firstName: e.target.value,
                      })
                    }
                  />
                  <input
                    className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    type="text"
                    placeholder="Last Name"
                    value={currentUser?.lastName || ""}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser!,
                        lastName: e.target.value,
                      })
                    }
                  />
                  <input
                    className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    type="tel"
                    placeholder="Phone"
                    value={currentUser?.phone || ""}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser!, phone: e.target.value })
                    }
                  />
                  <input
                    className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    type="email"
                    placeholder="Email"
                    value={currentUser?.email || ""}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser!, email: e.target.value })
                    }
                  />
                  <input
                    className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    type="password"
                    placeholder="Password"
                    value={currentUser?.password || ""}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser!,
                        password: e.target.value,
                      })
                    }
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                  >
                    {mode === "create" ? "Add" : "Update"}
                  </button>
                </form>
              </div>
              <button
                onClick={closeModal}
                className="absolute top-0 right-0 mt-4 mr-4 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
