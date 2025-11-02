import React, { useState, useMemo, useCallback } from 'react';
import type { AppState, Assignment } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import SpinningWheel from './components/SpinningWheel';

// Define component prop types
interface SetupViewProps {
  users: string[];
  newUser: string;
  setNewUser: (value: string) => void;
  handleUserKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleAddUser: () => void;
  handleRemoveUser: (user: string) => void;
  changeRequests: string[];
  newCR: string;
  setNewCR: (value: string) => void;
  handleCRKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleAddCR: () => void;
  handleRemoveCR: (index: number) => void;
  listName: string;
  setListName: (value: string) => void;
  handleSaveList: () => void;
  savedUserLists: Record<string, string[]>;
  handleLoadList: (name: string) => void;
  handleDeleteList: (name: string) => void;
  handleStart: () => void;
}

const SetupView: React.FC<SetupViewProps> = ({
  users, newUser, setNewUser, handleUserKeyPress, handleAddUser, handleRemoveUser,
  changeRequests, newCR, setNewCR, handleCRKeyPress, handleAddCR, handleRemoveCR,
  listName, setListName, handleSaveList, savedUserLists, handleLoadList, handleDeleteList,
  handleStart
}) => (
  <div className="p-4 md:p-8 max-w-4xl mx-auto">
    <header className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">wheel of undesirable selection</h1>
      <p className="text-slate-400 mt-2">Assigning the tasks no one wants. Spin the wheel and accept your fate.</p>
    </header>

    <div className="grid md:grid-cols-2 gap-8">
      {/* User Input Section */}
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col">
        <h2 className="text-2xl font-semibold mb-4 text-purple-300">1. Add Victims</h2>
          <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-grow bg-slate-900 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            placeholder="e.g., Unlucky Soul"
            value={newUser}
            onChange={e => setNewUser(e.target.value)}
            onKeyDown={handleUserKeyPress}
          />
          <button onClick={handleAddUser} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Add</button>
        </div>

        <div className="flex-grow h-40 bg-slate-900 border border-slate-700 rounded-md p-3 overflow-y-auto mb-4">
          {users.length > 0 ? (
              <ul className="space-y-2">
                  {users.map(user => (
                      <li key={user} className="flex justify-between items-center bg-slate-800 p-2 rounded">
                          <span>{user}</span>
                          <button onClick={() => handleRemoveUser(user)} className="text-red-400 hover:text-red-300 font-bold text-lg leading-none">×</button>
                      </li>
                  ))}
              </ul>
          ) : (
              <div className="flex items-center justify-center h-full">
                  <p className="text-slate-500">Add users to the list.</p>
              </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2 text-slate-300">Manage User Lists</h3>
          <div className="flex gap-2 mb-2">
            <input 
              type="text"
              placeholder="New list name..."
              value={listName}
              onChange={e => setListName(e.target.value)}
              className="flex-grow bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <button onClick={handleSaveList} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Save</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(savedUserLists).length > 0 ? Object.keys(savedUserLists).map(name => (
              <div key={name} className="flex items-center bg-slate-700 rounded-full">
                <button onClick={() => handleLoadList(name)} className="text-sm py-1 px-3 hover:bg-slate-600 rounded-l-full">{name}</button>
                <button onClick={() => handleDeleteList(name)} className="text-sm py-1 px-3 text-red-400 hover:bg-red-900/50 rounded-r-full">×</button>
              </div>
            )) : <p className="text-slate-500 text-sm">No saved lists.</p>}
          </div>
        </div>
      </div>

      {/* CR Input Section */}
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col">
        <h2 className="text-2xl font-semibold mb-4 text-pink-300">2. Add Unpleasant Tasks</h2>
          <div className="flex gap-2 mb-4">
          <input
            type="text"
            className="flex-grow bg-slate-900 border border-slate-700 rounded-md p-3 focus:ring-2 focus:ring-pink-500 focus:outline-none"
            placeholder="e.g., CR-666: Refactor Legacy Code"
            value={newCR}
            onChange={e => setNewCR(e.target.value)}
            onKeyDown={handleCRKeyPress}
          />
          <button onClick={handleAddCR} className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Add</button>
        </div>
        
        <div className="flex-grow h-64 bg-slate-900 border border-slate-700 rounded-md p-3 overflow-y-auto">
            {changeRequests.length > 0 ? (
                <ul className="space-y-2">
                    {changeRequests.map((cr, index) => (
                        <li key={`${cr}-${index}`} className="flex justify-between items-center bg-slate-800 p-2 rounded">
                            <span className="truncate pr-2">{cr}</span>
                            <button onClick={() => handleRemoveCR(index)} className="text-red-400 hover:text-red-300 font-bold text-lg leading-none ml-2">×</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-slate-500">Add CRs to the list.</p>
                </div>
            )}
        </div>
      </div>
    </div>

    <div className="text-center mt-8">
      <button 
        onClick={handleStart} 
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-12 rounded-full text-xl shadow-lg transform hover:scale-105 transition-transform"
      >
        Start Assigning
      </button>
    </div>
  </div>
);


interface AssignmentViewProps {
  handleReset: () => void;
  allCRsAssigned: boolean;
  changeRequests: string[];
  currentCRIndex: number;
  eligibleUsers: string[];
  isSpinning: boolean;
  spinResult: string | null;
  onSpinEnd: () => void;
  handleSpin: () => void;
  assignments: Assignment[];
  users: string[];
  userCounts: Record<string, number>;
}

const AssignmentView: React.FC<AssignmentViewProps> = ({
  handleReset, allCRsAssigned, changeRequests, currentCRIndex, eligibleUsers,
  isSpinning, spinResult, onSpinEnd, handleSpin, assignments, users, userCounts
}) => (
  <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">wheel of undesirable selection</h1>
          <button onClick={handleReset} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Start Over</button>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side: Wheel & Controls */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
              <div className="text-center mb-4">
                  {allCRsAssigned ? (
                      <h2 className="text-3xl font-bold text-green-400">All Done! 🎉</h2>
                  ) : (
                      <>
                          <p className="text-slate-400">Next to Assign:</p>
                          <h2 className="text-2xl md:text-3xl font-bold text-purple-300 truncate max-w-sm">{changeRequests[currentCRIndex]}</h2>
                      </>
                  )}
              </div>

              <SpinningWheel
                  users={eligibleUsers}
                  isSpinning={isSpinning}
                  targetUser={spinResult}
                  onSpinEnd={onSpinEnd}
              />

              <button
                  onClick={handleSpin}
                  disabled={isSpinning || allCRsAssigned}
                  className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-16 rounded-full text-2xl shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                  {isSpinning ? 'Spinning...' : 'SPIN'}
              </button>

              {!isSpinning && spinResult && assignments.length > 0 && (
                  <p className="mt-6 text-xl text-center text-green-400 animate-pulse">
                      <span className="font-normal text-slate-300">{assignments[assignments.length - 1].cr} was assigned to</span> {spinResult}!
                  </p>
              )}
          </div>

          {/* Right Side: Summaries */}
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
              <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-pink-300">User Workload</h3>
                  <div className="space-y-2">
                      {users.map(user => (
                          <div key={user} className="flex justify-between items-center bg-slate-700/50 p-2 rounded-md">
                              <span className="font-medium">{user}</span>
                              <span className="font-bold text-xl bg-slate-900 px-3 py-1 rounded-full text-purple-300">{userCounts[user] || 0}</span>
                          </div>
                      ))}
                  </div>
              </div>
              <div>
                  <h3 className="text-xl font-semibold mb-3 text-purple-300">Assignment Log</h3>
                  <div className="h-96 overflow-y-auto bg-slate-900 p-3 rounded-md border border-slate-700">
                      {assignments.length > 0 ? (
                          <ul className="space-y-2">
                              {[...assignments].reverse().map((a, i) => (
                                  <li key={`${a.cr}-${i}`} className="flex justify-between text-sm p-2 rounded bg-slate-800">
                                      <span className="text-slate-400 truncate pr-2">{a.cr}</span>
                                      <span className="font-semibold text-pink-300 text-right shrink-0">→ {a.user}</span>
                                  </li>
                              ))}
                          </ul>
                      ) : (
                          <p className="text-slate-500 text-center pt-10">Spin the wheel to start assigning CRs.</p>
                      )}
                  </div>
              </div>
          </div>
      </div>
  </div>
);


const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('SETUP');
  
  const [savedUserLists, setSavedUserLists] = useLocalStorage<Record<string, string[]>>('cr-assigner-user-lists', {});
  
  const [users, setUsers] = useState<string[]>([]);
  const [newUser, setNewUser] = useState('');

  const [changeRequests, setChangeRequests] = useState<string[]>([]);
  const [newCR, setNewCR] = useState('');
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentCRIndex, setCurrentCRIndex] = useState(0);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);

  const [listName, setListName] = useState('');

  // User management handlers
  const handleAddUser = () => {
    const trimmedUser = newUser.trim();
    if (trimmedUser && !users.includes(trimmedUser)) {
        setUsers(prev => [...prev, trimmedUser]);
        setNewUser('');
    }
  };

  const handleUserKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          handleAddUser();
      }
  };

  const handleRemoveUser = (userToRemove: string) => {
      setUsers(prev => prev.filter(user => user !== userToRemove));
  };

  // CR management handlers
  const handleAddCR = () => {
    const trimmedCR = newCR.trim();
    if (trimmedCR) { // Allow duplicate CR names/IDs
        setChangeRequests(prev => [...prev, trimmedCR]);
        setNewCR('');
    }
  };

  const handleCRKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          handleAddCR();
      }
  };
  
  const handleRemoveCR = (indexToRemove: number) => {
      setChangeRequests(prev => prev.filter((_, index) => index !== indexToRemove));
  };


  const handleStart = () => {
    if (users.length === 0 || changeRequests.length === 0) {
      alert('Please provide at least one user and one Change Request.');
      return;
    }
    setAppState('ASSIGNING');
  };

  const handleReset = () => {
    setAppState('SETUP');
    setAssignments([]);
    setCurrentCRIndex(0);
    setIsSpinning(false);
    setSpinResult(null);
    setUsers([]);
    setChangeRequests([]);
  };

  const { eligibleUsers, userCounts } = useMemo(() => {
    if (users.length === 0) return { eligibleUsers: [], userCounts: {} };

    const counts: Record<string, number> = users.reduce((acc, user) => ({ ...acc, [user]: 0 }), {});
    assignments.forEach(a => {
      if (counts[a.user] !== undefined) {
        counts[a.user]++;
      }
    });

    if (Object.keys(counts).length === 0) return { eligibleUsers: users, userCounts: counts };

    const minAssignments = Math.min(...Object.values(counts));
    const eligible = users.filter(user => counts[user] === minAssignments);
    
    return { eligibleUsers: eligible.length > 0 ? eligible : users, userCounts: counts };
  }, [users, assignments]);

  const handleSpin = useCallback(() => {
    if (isSpinning || currentCRIndex >= changeRequests.length || eligibleUsers.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * eligibleUsers.length);
    const selectedUser = eligibleUsers[randomIndex];
    setSpinResult(selectedUser);
    setIsSpinning(true);
  }, [isSpinning, currentCRIndex, changeRequests.length, eligibleUsers]);

  const onSpinEnd = useCallback(() => {
    if (!spinResult) return;
    
    const newAssignment: Assignment = {
      cr: changeRequests[currentCRIndex],
      user: spinResult,
    };
    setAssignments(prev => [...prev, newAssignment]);
    setCurrentCRIndex(prev => prev + 1);
    setIsSpinning(false);
    // spinResult is kept to display the result message until next spin
  }, [spinResult, changeRequests, currentCRIndex]);

  const handleSaveList = () => {
    if (!listName || users.length === 0) {
      alert('Please provide a name for the list and add some users.');
      return;
    }
    setSavedUserLists(prev => ({ ...prev, [listName]: users }));
    setListName('');
  };

  const handleLoadList = (name: string) => {
    if (savedUserLists[name]) {
      setUsers(savedUserLists[name]);
    }
  };

  const handleDeleteList = (name: string) => {
    const newLists = { ...savedUserLists };
    delete newLists[name];
    setSavedUserLists(newLists);
  };
  
  const allCRsAssigned = currentCRIndex >= changeRequests.length;


  return (
    <main className="min-h-screen w-full font-sans">
      {appState === 'SETUP' ? 
        <SetupView 
            users={users}
            newUser={newUser}
            setNewUser={setNewUser}
            handleUserKeyPress={handleUserKeyPress}
            handleAddUser={handleAddUser}
            handleRemoveUser={handleRemoveUser}
            changeRequests={changeRequests}
            newCR={newCR}
            setNewCR={setNewCR}
            handleCRKeyPress={handleCRKeyPress}
            handleAddCR={handleAddCR}
            handleRemoveCR={handleRemoveCR}
            listName={listName}
            setListName={setListName}
            handleSaveList={handleSaveList}
            savedUserLists={savedUserLists}
            handleLoadList={handleLoadList}
            handleDeleteList={handleDeleteList}
            handleStart={handleStart}
        /> : 
        <AssignmentView 
            handleReset={handleReset}
            allCRsAssigned={allCRsAssigned}
            changeRequests={changeRequests}
            currentCRIndex={currentCRIndex}
            eligibleUsers={eligibleUsers}
            isSpinning={isSpinning}
            spinResult={spinResult}
            onSpinEnd={onSpinEnd}
            handleSpin={handleSpin}
            assignments={assignments}
            users={users}
            userCounts={userCounts}
        />}
    </main>
  );
};

export default App;