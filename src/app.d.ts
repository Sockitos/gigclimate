import type { Database } from '$lib/types/supabase-types.gen';
import { Session, SupabaseClient } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession(): Promise<{ session: Session | null; user: User | null }>;
		}
		interface PageData {
			supabase: SupabaseClient<Database>;
			session: Session | null;
			user: User | null;
		}
		// interface Error {}
		// interface Platform {}
	}
}
