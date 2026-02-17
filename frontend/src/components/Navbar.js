import { useNavigate } from "react-router-dom";

function Navbar({ profile }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div>
        <h1 className="font-bold text-lg">Dashboard</h1>
        {profile && (
          <p className="text-sm text-gray-300">
            Welcome, {profile.name}
          </p>
        )}
      </div>

      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;
