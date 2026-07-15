import { auth, db, signInWithPopup, googleProvider, signOut, onAuthStateChanged, doc, getDoc, setDoc } from './firebase.js';

const STORAGE_KEY = 'chemdata_journey_state_v2';

const defaultState = {
  settings: {
    theme: 'dark',
    dailyHoursGoal: 2,
    userName: 'Artur Rech',
    userRole: 'Cientista de Dados Químicos',
    targetRole: 'Data Scientist Sênior'
  },
  courses: {
    'py-1': 'todo', 'py-2': 'todo', 'py-3': 'todo', 'py-4': 'todo',
    'sql-1': 'todo', 'sql-2': 'todo', 'sql-3': 'todo', 'sql-4': 'todo',
    'est-1': 'todo', 'est-2': 'todo', 'est-3': 'todo', 'est-4': 'todo',
    'ml-1': 'todo', 'ml-2': 'todo', 'ml-3': 'todo', 'ml-4': 'todo',
    'kag-1': 'todo', 'kag-2': 'todo', 'kag-3': 'todo', 'kag-4': 'todo',
    'proj-1': 'todo', 'proj-2': 'todo', 'proj-3': 'todo', 'proj-4': 'todo'
  },
  courseLinks: {},
  completedWeeks: [],
  studyLogs: [],
  diary: {}
};

function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let authReadyResolver;
let initialAuthFired = false;
const authReadyPromise = new Promise(resolve => {
  authReadyResolver = resolve;
});

onAuthStateChanged(auth, (user) => {
  if (authReadyResolver) {
    authReadyResolver(user);
    authReadyResolver = null;
  }
  
  if (initialAuthFired) {
    // Se o usuário logar/deslogar durante a sessão, recarregar a página para o app puxar os dados
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { user } }));
  }
  initialAuthFired = true;
});

const StorageEngine = {
  getDefaultState() {
    return JSON.parse(JSON.stringify(defaultState));
  },
  
  async initAuth() {
    return authReadyPromise;
  },

  async login() {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error(e);
      alert('Erro ao fazer login com o Google.');
    }
  },

  async logout() {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  },

  async loadState() {
    const user = auth.currentUser;
    let parsed = null;
    let localParsed = null;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) localParsed = JSON.parse(stored);
    } catch (e) {}

    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          parsed = snapshot.data();
        } else if (localParsed) {
          // If first login and has local data, migrate it to firebase
          parsed = localParsed;
          await this.saveState(parsed);
        }
      } catch (e) {
        handleFirestoreError(e, 'get', `users/${user.uid}`);
      }
    } else {
      // Fallback local storage
      parsed = localParsed;
    }

    if (parsed) {
      return {
        ...defaultState,
        ...parsed,
        settings: { ...defaultState.settings, ...parsed.settings },
        courses: { ...defaultState.courses, ...parsed.courses },
        courseLinks: { ...defaultState.courseLinks, ...parsed.courseLinks },
        diary: { ...defaultState.diary, ...parsed.diary }
      };
    }
    return null;
  },

  async saveState(state) {
    const user = auth.currentUser;
    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, state);
        return true;
      } catch (e) {
        handleFirestoreError(e, 'update', `users/${user.uid}`);
        return false;
      }
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        return true;
      } catch (e) {
        return false;
      }
    }
  },

  async resetState() {
    const state = JSON.parse(JSON.stringify(defaultState));
    await this.saveState(state);
    return state;
  },

  exportJSON(state) {
    return JSON.stringify(state, null, 2);
  },

  async importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object' && parsed.settings && parsed.courses) {
        const merged = {
          ...defaultState,
          ...parsed,
          settings: { ...defaultState.settings, ...parsed.settings },
          courses: { ...defaultState.courses, ...parsed.courses },
          courseLinks: { ...defaultState.courseLinks, ...parsed.courseLinks },
          diary: { ...defaultState.diary, ...parsed.diary }
        };
        await this.saveState(merged);
        return { success: true, state: merged };
      }
      return { success: false, error: 'Formato inválido.' };
    } catch (e) {
      return { success: false, error: 'JSON malformado.' };
    }
  }
};

window.StorageEngine = StorageEngine;
window.auth = auth; // Expose auth to UI
