import { setActivePinia, createPinia } from 'pinia'
import userStore from '@/stores/user'
import { vi, describe, it, expect, beforeEach } from 'vitest'

// Hoist mocks
const mockCreateUser = vi.hoisted(() => vi.fn(() => Promise.resolve({ user: { uid: 'testuid' } })))
const mockUpdateProfile = vi.hoisted(() => vi.fn(() => Promise.resolve()))
const mockSetDoc = vi.hoisted(() => vi.fn(() => Promise.resolve()))

// Mock Firebase AUTH modules
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: mockCreateUser,
  updateProfile: mockUpdateProfile,
  signInWithEmailAndPassword: vi.fn(() => Promise.resolve()),
  signOut: vi.fn()
}))

// Mock Firebase FIRESTORE modules
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: mockSetDoc
}))

// Mock our exports from firebase.js
vi.mock('@/includes/firebase', () => ({
  auth: {},
  usersCollection: {}
}))

/**
 * TEST GROUP for User Store (Pinia)
 */
describe('user store', () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = userStore()
    vi.clearAllMocks()
  })

  /**
   * TEST CASE 01: Test if register() method works correctly
   */
  it('registers a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      age: 25,
      country: 'Test Country'
    }

    expect(store.userLoggedIn).toBe(false)

    await store.register(userData)

    // Check if createUserWithEmailAndPassword was called with correct arguments
    expect(mockCreateUser).toHaveBeenCalledWith(
      expect.anything(),
      userData.email,
      userData.password
    )

    // Check if setDoc was called
    expect(mockSetDoc).toHaveBeenCalled()

    // Check if updateProfile was called with correct arguments
    expect(mockUpdateProfile).toHaveBeenCalledWith(expect.anything(), {
      displayName: userData.name
    })

    // Check if userLoggedIn state was updated
    expect(store.userLoggedIn).toBe(true)
  })

  /**
   * TEST CASE 02: Test if login() method works correctly
   */
  it('authenticates user (aka login())', async () => {
    // CHECK 01: Check that userLoggedIn is false by default
    expect(store.userLoggedIn).toBe(false)

    // Call login with mock credentials
    await store.login({ email: 'test@example.com', password: 'password123' })

    // CHECK 02: Check that userLoggedIn is true after login() is called
    expect(store.userLoggedIn).toBe(true)
  })

  /**
   * TEST CASE 03: Test if logout() method works correctly
   */
  it('authenticates user (aka logout())', async () => {
    // CHECK 01: Check that userLoggedIn is false by default
    expect(store.userLoggedIn).toBe(false)

    // Call login with mock credentials
    await store.login({ email: 'test@example.com', password: 'password123' })

    // CHECK 02: Check that userLoggedIn is true after login() is called
    expect(store.userLoggedIn).toBe(true)

    // Call logout with mock credentials
    await store.logout()

    // CHECK 03: Check that userLoggedIn is false again after logout() is called
    expect(store.userLoggedIn).toBe(false)
  })
}) //describe('user store', () => { ...
