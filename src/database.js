// GurukulAI Database — stores all user data in localStorage

export const db = {
  register: (data) => {
    const users = db.getUsers();
    const existing = users.find(u => u.phone === data.phone);
    if (existing) return { success: false, error: "Phone already registered" };
    users.push(data);
    localStorage.setItem('gurukul_users', JSON.stringify(users));
    localStorage.setItem('gurukul_current_user', JSON.stringify(data));
    return { success: true };
  },
  login: (phone, password) => {
    const users = db.getUsers();
    const user = users.find(u => u.phone === phone && u.password === password);
    if (!user) return { success: false, error: "Invalid phone or password" };
    localStorage.setItem('gurukul_current_user', JSON.stringify(user));
    return { success: true, user };
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('gurukul_current_user');
    return user ? JSON.parse(user) : null;
  },
  getUsers: () => {
    const users = localStorage.getItem('gurukul_users');
    return users ? JSON.parse(users) : [];
  },
  logout: () => { localStorage.removeItem('gurukul_current_user'); },
  updateUser: (data) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.phone === data.phone);
    if (index !== -1) {
      users[index] = data;
      localStorage.setItem('gurukul_users', JSON.stringify(users));
      localStorage.setItem('gurukul_current_user', JSON.stringify(data));
    }
  },
  saveSession: (data) => { localStorage.setItem('gurukul_session', JSON.stringify(data)); },
  getSession: () => { const s = localStorage.getItem('gurukul_session'); return s ? JSON.parse(s) : null; },
  clearSession: () => { localStorage.removeItem('gurukul_session'); }
};

export const createDemoUser = () => {
  const demo = {
    studentName: "Priya", studentLastName: "Sharma",
    fatherName: "Rajesh", fatherLastName: "Sharma",
    motherName: "Sunita", motherLastName: "Sharma",
    phone: "9999999999", password: "demo123", pin: "1234",
    class: "10", stream: "PCM", city: "Mumbai",
    school: "Delhi Public School", createdAt: new Date().toISOString()
  };
  const users = JSON.parse(localStorage.getItem('gurukul_users') || '[]');
  if (!users.find(u => u.phone === demo.phone)) {
    users.push(demo);
    localStorage.setItem('gurukul_users', JSON.stringify(users));
  }
};
