namespace BookstoreWebAPI.Exceptions
{
    public class DuplicateDocumentException : Exception
    {
        public DuplicateDocumentException(string message):base(message) {}
    }
}
