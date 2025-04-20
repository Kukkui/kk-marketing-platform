/**
 * Service layer for Account feature.
 * Handles business logic for Account CRUD operations using PostgreSQL.
 */

import bcrypt from 'bcrypt';
import pool from '../../config/db';
import { Account, AccountPayload, LoginResponse } from '../../shared/types/accountTypes';

const SALT_ROUNDS = 10;

/**
 * Creates a new account.
 * @param payload - The account data to create.
 * @returns The created account.
 */
export async function createAccount(payload: AccountPayload): Promise<Account> {
  const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);
  const query = `
    INSERT INTO account (email, password)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [payload.email, hashedPassword];
  const { rows } = await pool.query(query, values);
  return rows[0] as Account;
}

/**
 * Authenticates a user by email and password.
 * @param email - The user's email.
 * @param password - The user's plaintext password.
 * @returns LoginResponse with status and optional message.
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
    console.log({
        email,
        password,
    })
    const query = 'SELECT * FROM account WHERE email = $1;';
    const { rows } = await pool.query(query, [email]);
    
    if (rows.length === 0) {
        return { 
            status: 'failed', 
            message: 'No account found!' 
        };
    }

    const account = rows[0] as Account;
    const isPasswordValid = await bcrypt.compare(password, account.password);
    
    if (!isPasswordValid) {
      return {
        status: 'failed',
        message: 'Invalid password!',
      }
    }
  
    return { status: 'success', message: 'Login successful' };
}

/**
 * Retrieves all accounts.
 * @returns List of all accounts.
 */
export async function getAllAccounts(): Promise<Account[]> {
  const query = 'SELECT * FROM account;';
  const { rows } = await pool.query(query);
  return rows as Account[];
}

/**
 * Retrieves an account by ID.
 * @param id - The account ID.
 * @returns The account if found, or undefined.
 */
export async function getAccountById(id: number): Promise<Account | undefined> {
  const query = 'SELECT * FROM account WHERE id = $1;';
  const { rows } = await pool.query(query, [id]);
  return rows.length > 0 ? (rows[0] as Account) : undefined;
}

/**
 * Updates an account by ID.
 * @param id - The account ID.
 * @param payload - The updated account data.
 * @returns The updated account, or undefined if not found.
 */
export async function updateAccount(id: number, payload: AccountPayload): Promise<Account | undefined> {
  const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);
  const query = `
    UPDATE account
    SET email = $1, password = $2
    WHERE id = $3
    RETURNING *;
  `;
  const values = [payload.email, hashedPassword, id];
  const { rows } = await pool.query(query, values);
  return rows.length > 0 ? (rows[0] as Account) : undefined;
}

/**
 * Deletes an account by ID.
 * @param id - The account ID.
 * @returns True if deleted, false if not found.
 */
export async function deleteAccount(id: number): Promise<boolean> {
  const query = 'DELETE FROM account WHERE id = $1;';
  const { rowCount } = await pool.query(query, [id]);
  return rowCount ? rowCount > 0 : false;
}