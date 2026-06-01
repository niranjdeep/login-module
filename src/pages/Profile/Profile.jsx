
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    image:
      user?.image ||
      "https://ui-avatars.com/api/?name=User",
  });

  return (
    <div className="profile-page">

      <div className="profile-banner"></div>

      <div className="profile-card">

        <img
          src={formData.image}
          alt="profile"
          className="profile-image"
        />

        <h2>{formData.name}</h2>

        <div className="profile-info">
          <p>
            <strong>Email:</strong> {formData.email}
          </p>

          <p>
            <strong>Phone:</strong> {formData.phone}
          </p>
        </div>

      </div>

    </div>
  );
};

export default Profile;