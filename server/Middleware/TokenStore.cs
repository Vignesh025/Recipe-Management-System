using System.Collections.Concurrent;

namespace server.Middleware
{
    public static class TokenStore
    {
        private static readonly ConcurrentDictionary<string, int> _tokens = new ConcurrentDictionary<string, int>();

        public static void StoreToken(string token, int userId)
        {
            _tokens[token] = userId;
        }

        public static bool TryGetUserId(string token, out int userId)
        {
            return _tokens.TryGetValue(token, out userId);
        }

        public static void RemoveToken(string token)
        {
            _tokens.TryRemove(token, out _);
        }
    }
} 