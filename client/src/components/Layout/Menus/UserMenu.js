export const getUserMenu = (role) => {
  const commonItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "fa-solid fa-house",
    },
    {
      name: "Update Profile",
      path: "/user/profile",
      icon: "fa-solid fa-user",
    },
  ];

  const employeeItems = [
    {
      name: "Post Job",
      path: "/post-job",
      icon: "fa-solid fa-plus",
    },
    {
      name: "Latest Jobs",
      path: "/jobs",
      icon: "fa-solid fa-briefcase",
    },
  ];

  const userItems = [
    {
      name: "Latest Jobs",
      path: "/jobs",
      icon: "fa-solid fa-briefcase",
    },
  ];

  const adminItems = [
    {
      name: "Create Employee",
      path: "/create-employee",
      icon: "fa-solid fa-user-plus",
    },
  ];

  if (role === 'admin') {
    return [...commonItems, ...adminItems];
  } else if (role === 'employee') {
    return [...commonItems, ...employeeItems];
  } else {
    return [...commonItems, ...userItems];
  }
};
