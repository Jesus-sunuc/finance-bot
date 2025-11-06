import { useAuth } from "react-oidc-context";

const Profile = () => {
  const auth = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Profile</h1>
        <p className="text-gray-400">View your account information</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-white">
              {auth.user?.profile.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-100 mb-1">
              {auth.user?.profile.name || auth.user?.profile.email || "User"}
            </h2>
            <p className="text-gray-400">
              {auth.user?.profile.email || "No email"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Account Type</p>
              <p className="text-gray-100 font-medium">Standard</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Member Since</p>
              <p className="text-gray-100 font-medium">Nov 2025</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Expenses</p>
              <p className="text-gray-100 font-medium">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Active Budgets</p>
              <p className="text-gray-100 font-medium">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
