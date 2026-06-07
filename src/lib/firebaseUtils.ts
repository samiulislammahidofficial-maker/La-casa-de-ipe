// Mock Firebase Utilities with LocalStorage Persistence
// Replaces real Firebase initialization with a client-only mockup.

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

// Initial Mock Data (Money Heist Characters)
const initialUsers = {
  'professor-uid': {
    name: 'Professor (Sergio)',
    rollNumber: '2508001',
    email: 'admin@buet.edu',
    department: 'IPE',
    hall: 'Rashid Hall',
    contact: '+8801711111111',
    role: 'admin'
  },
  'tokyo-uid': {
    name: 'Tokyo (Silene)',
    rollNumber: '2508002',
    email: 'tokyo@lacasadeipe.edu',
    department: 'IPE',
    hall: 'Sony hall',
    contact: '+8801722222222',
    role: 'student'
  },
  'berlin-uid': {
    name: 'Berlin (Andrés)',
    rollNumber: '2508003',
    email: 'berlin@lacasadeipe.edu',
    department: 'IPE',
    hall: 'Ahshanullah Hall',
    contact: '+8801733333333',
    role: 'student'
  },
  'denver-uid': {
    name: 'Denver (Daniel)',
    rollNumber: '2508004',
    email: 'denver@lacasadeipe.edu',
    department: 'IPE',
    hall: 'Titumir Hall',
    contact: '+8801744444444',
    role: 'student'
  },
  'nairobi-uid': {
    name: 'Nairobi (Ágata)',
    rollNumber: '2508005',
    email: 'nairobi@lacasadeipe.edu',
    department: 'IPE',
    hall: 'Sony hall',
    contact: '+8801755555555',
    role: 'student'
  }
};

const initialRegistrations = [
  { id: 'reg-1', userId: 'tokyo-uid', eventName: 'Treasure Hunt', timestamp: new Date('2026-06-06T12:00:00Z').toISOString() },
  { id: 'reg-2', userId: 'tokyo-uid', eventName: 'Tug of War', timestamp: new Date('2026-06-06T12:05:00Z').toISOString() },
  { id: 'reg-3', userId: 'berlin-uid', eventName: 'Chess Tournament', timestamp: new Date('2026-06-06T12:10:00Z').toISOString() },
  { id: 'reg-4', userId: 'berlin-uid', eventName: 'Case Competition Seminar', timestamp: new Date('2026-06-06T12:15:00Z').toISOString() },
  { id: 'reg-5', userId: 'denver-uid', eventName: 'FIFA', timestamp: new Date('2026-06-06T12:20:00Z').toISOString() },
  { id: 'reg-6', userId: 'denver-uid', eventName: 'PES', timestamp: new Date('2026-06-06T12:25:00Z').toISOString() },
  { id: 'reg-7', userId: 'nairobi-uid', eventName: 'Musical Chairs', timestamp: new Date('2026-06-06T12:30:00Z').toISOString() },
  { id: 'reg-8', userId: 'nairobi-uid', eventName: 'Art Contest', timestamp: new Date('2026-06-06T12:35:00Z').toISOString() }
];

const getMockUsers = () => {
  const users = localStorage.getItem('mock_users');
  if (!users) {
    localStorage.setItem('mock_users', JSON.stringify(initialUsers));
    return initialUsers;
  }
  return JSON.parse(users);
};

const setMockUsers = (users: any) => {
  localStorage.setItem('mock_users', JSON.stringify(users));
};

const getMockRegistrations = () => {
  const regs = localStorage.getItem('mock_registrations');
  if (!regs) {
    localStorage.setItem('mock_registrations', JSON.stringify(initialRegistrations));
    return initialRegistrations;
  }
  return JSON.parse(regs);
};

const setMockRegistrations = (regs: any) => {
  localStorage.setItem('mock_registrations', JSON.stringify(regs));
};

// --- MOCK AUTHENTICATION SYSTEM ---

class MockAuth {
  private listeners: ((user: any) => void)[] = [];

  get currentUser() {
    const userStr = localStorage.getItem('mock_auth_user');
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.name || user.email.split('@')[0],
      emailVerified: true,
      isAnonymous: user.isAnonymous || false,
      tenantId: null,
      providerData: user.providerId ? [{ providerId: user.providerId, email: user.email }] : []
    };
  }

  subscribe(listener: (user: any) => void) {
    this.listeners.push(listener);
    // Notify immediately
    listener(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  triggerChange() {
    const user = this.currentUser;
    this.listeners.forEach(l => l(user));
  }
}

export const auth = new MockAuth();

export function onAuthStateChanged(authInstance: MockAuth, callback: (user: any) => void) {
  return authInstance.subscribe(callback);
}

export async function signOut(authInstance: MockAuth) {
  localStorage.removeItem('mock_auth_user');
  authInstance.triggerChange();
}

export async function signInWithEmailAndPassword(authInstance: MockAuth, email: string, password?: string) {
  const users = getMockUsers();
  const foundUserKey = Object.keys(users).find(uid => users[uid].email === email);
  if (foundUserKey) {
    const userData = users[foundUserKey];
    const user = { uid: foundUserKey, ...userData };
    localStorage.setItem('mock_auth_user', JSON.stringify(user));
    authInstance.triggerChange();
    return { user };
  } else {
    // If logging in as admin/Professor but not in DB, create it
    if (email === 'admin@buet.edu') {
      const user = { uid: 'professor-uid', name: 'Professor (Sergio)', email: 'admin@buet.edu', role: 'admin', rollNumber: '2508001' };
      users['professor-uid'] = user;
      setMockUsers(users);
      localStorage.setItem('mock_auth_user', JSON.stringify(user));
      authInstance.triggerChange();
      return { user };
    }
    throw new Error('Operative email not registered. Please sign up first.');
  }
}

export async function createUserWithEmailAndPassword(authInstance: MockAuth, email: string, password?: string) {
  const uid = 'mock-uid-' + Math.random().toString(36).substr(2, 9);
  const user = { uid, email, isAnonymous: false };
  localStorage.setItem('mock_auth_user', JSON.stringify(user));
  return { user };
}

export async function signInAnonymously(authInstance: MockAuth) {
  const uid = 'guest-uid-' + Math.random().toString(36).substr(2, 9);
  const user = { uid, email: 'guest@example.com', name: 'Guest User', isAnonymous: true, role: 'student' };
  localStorage.setItem('mock_auth_user', JSON.stringify(user));
  authInstance.triggerChange();
  return { user };
}

export class GoogleAuthProvider {}
export class FacebookAuthProvider {}

export async function signInWithPopup(authInstance: MockAuth, provider: any) {
  const providerName = provider.constructor.name === 'GoogleAuthProvider' ? 'Google' : 'Facebook';
  const uid = 'social-uid-' + Math.random().toString(36).substr(2, 9);
  const user = {
    uid,
    email: `${providerName.toLowerCase()}user@example.com`,
    name: `${providerName} User`,
    isAnonymous: false,
    role: 'student',
    providerId: providerName.toLowerCase()
  };
  localStorage.setItem('mock_auth_user', JSON.stringify(user));
  authInstance.triggerChange();
  return { user };
}

// --- MOCK FIRESTORE SYSTEM ---

export const db = {};

export function collection(dbInstance: any, name: string) {
  return { type: 'collection', name };
}

export function doc(dbInstance: any, collectionName: string, id: string) {
  return { type: 'doc', collectionName, id };
}

export async function getDoc(docRef: any) {
  if (docRef.collectionName === 'users') {
    const users = getMockUsers();
    const userData = users[docRef.id];
    return {
      exists: () => !!userData,
      data: () => userData
    };
  }
  return {
    exists: () => false,
    data: () => null
  };
}

export async function getDocs(queryRef: any) {
  const collectionName = queryRef.collectionName || queryRef.name || '';
  if (collectionName === 'users') {
    const users = getMockUsers();
    const docs = Object.keys(users).map(id => ({
      id,
      data: () => users[id]
    }));
    return { docs, empty: docs.length === 0 };
  } else if (collectionName === 'registrations') {
    let regs = getMockRegistrations();
    if (queryRef.filters) {
      queryRef.filters.forEach((f: any) => {
        if (f.field === 'userId' && f.op === '==') {
          regs = regs.filter((r: any) => r.userId === f.val);
        }
        if (f.field === 'eventName' && f.op === '==') {
          regs = regs.filter((r: any) => r.eventName === f.val);
        }
      });
    }
    const docs = regs.map((r: any) => ({
      id: r.id,
      data: () => r
    }));
    return { docs, empty: docs.length === 0 };
  }
  return { docs: [], empty: true };
}

export async function addDoc(collectionRef: any, data: any) {
  if (collectionRef.name === 'registrations') {
    const regs = getMockRegistrations();
    const id = 'reg-' + Math.random().toString(36).substr(2, 9);
    const newReg = {
      id,
      ...data,
      timestamp: data.timestamp ? (data.timestamp instanceof Date ? data.timestamp.toISOString() : data.timestamp) : new Date().toISOString()
    };
    regs.unshift(newReg);
    setMockRegistrations(regs);
    triggerSnapshotListeners('registrations');
    return { id };
  }
  return { id: 'mock-id' };
}

export async function setDoc(docRef: any, data: any) {
  if (docRef.collectionName === 'users') {
    const users = getMockUsers();
    users[docRef.id] = {
      ...users[docRef.id],
      ...data
    };
    setMockUsers(users);
  }
}

const snapshotListeners: { [collectionName: string]: ((snapshot: any) => void)[] } = {};

const triggerSnapshotListeners = (collectionName: string) => {
  if (snapshotListeners[collectionName]) {
    getDocs({ collectionName }).then(snapshot => {
      snapshotListeners[collectionName].forEach(cb => cb(snapshot));
    });
  }
};

export function onSnapshot(queryRef: any, callback: (snapshot: any) => void) {
  const collectionName = queryRef.collectionName || queryRef.name || '';
  if (!snapshotListeners[collectionName]) {
    snapshotListeners[collectionName] = [];
  }
  snapshotListeners[collectionName].push(callback);
  
  getDocs(queryRef).then(snapshot => {
    callback(snapshot);
  });
  
  return () => {
    snapshotListeners[collectionName] = snapshotListeners[collectionName].filter(cb => cb !== callback);
  };
}

export function query(collectionRef: any, ...constraints: any[]) {
  const q = {
    collectionName: collectionRef.name,
    filters: [] as any[],
    sorts: [] as any[]
  };
  constraints.forEach(c => {
    if (c.type === 'where') {
      q.filters.push({ field: c.field, op: c.op, val: c.val });
    } else if (c.type === 'orderBy') {
      q.sorts.push({ field: c.field, dir: c.dir });
    }
  });
  return q;
}

export function where(field: string, op: string, val: any) {
  return { type: 'where', field, op, val };
}

export function orderBy(field: string, dir: string = 'asc') {
  return { type: 'orderBy', field, dir };
}

export function serverTimestamp() {
  return new Date().toISOString();
}

// User Document Creation
export async function createUserDocument(userId: string, data: any) {
  const users = getMockUsers();
  const role = data.email === 'admin@buet.edu' ? 'admin' : 'student';
  users[userId] = {
    ...data,
    role,
    createdAt: new Date().toISOString()
  };
  setMockUsers(users);
  
  const currentAuthUser = localStorage.getItem('mock_auth_user');
  if (currentAuthUser) {
    const user = JSON.parse(currentAuthUser);
    if (user.uid === userId) {
      localStorage.setItem('mock_auth_user', JSON.stringify({ ...user, ...data, role }));
    }
  }
  
  auth.triggerChange();
}

// Event Registration helper
export async function registerForEvent(userId: string, eventName: string) {
  const regs = getMockRegistrations();
  const id = 'reg-' + Math.random().toString(36).substr(2, 9);
  regs.unshift({
    id,
    userId,
    eventName,
    timestamp: new Date().toISOString()
  });
  setMockRegistrations(regs);
  triggerSnapshotListeners('registrations');
}
