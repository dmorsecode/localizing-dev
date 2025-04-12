import { fail, error } from '@sveltejs/kit';
import type { RequestEvent } from "./$types.js";
import { getFullLeaderboard } from '$lib/server/services/leaderboardService';

export const ssr = true;
export const prerender = true; 

export async function load(event: RequestEvent) {
    const rankings : any = await getFullLeaderboard();
    const leaderboard = await rankings.map((rank : any) => {
        return {
            username: rank.user.username,
            avatar_url: rank.user.avatar,
            score: rank.leaderboard.l_score
        };
    });

    return {
        leaderboard: await leaderboard,
    };
}