namespace SE100_BookstoreWebAPI.Utils
{
    public class IdUtils
    {
        public static string IncreaseId(string id)
        {
            if (!String.IsNullOrEmpty(id))
            {
                string prefix = id.Substring(0, 4);
                string numericPart = id.Substring(4);

                if (int.TryParse(numericPart, out int numericValue))
                {
                    numericValue++;

                    string newId = $"{prefix}{numericValue.ToString("D5")}";
                    return newId;
                }
            }

            return id;
        }
    }
}
