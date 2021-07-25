namespace EasyImport.WebApi.Specifications
{
    public class CategorySpecParams
    {
        private const int MaxPageSize = 50;
        public int PageIndex { get; set; } = 1;
        public string Sort { get; set; }

        private int _pageSize = 10;

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value) > MaxPageSize ? MaxPageSize : value;
        }

        private string _search;

        public string Search
        {
            get => _search;
            set => _search = value.ToLower();
        }

    }
}