let navbar = document.getElementById('navbar')
navbar.innerHTML = `
<nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <div class="logoContainer">
                <a class="navbar-brand" href="#"><img
                        src="https://vdnh.ru/local/templates/v3_new_header/images/logo.svg" alt="" width="60"
                        height="60"></a>
            </div>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active navText" aria-current="page" href="#">События</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link navText" href="#">Экскурсия</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link navText" href="#">Посетителям</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link navText " href="#">Билеты</a>
                    </li>
                    <li class="nav-item ">
                        <a class="nav-link navText" href="#">Новости</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link navText" href="#">Котнакты</a>
                    </li>
                    <li class="nav-item dropdown ">
                        <a class="nav-link dropdown-toggle navText" href="#" id="navbarDropdown" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            Ещё
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <li><a class="dropdown-item navText" href="#">Action</a></li>
                            <li><a class="dropdown-item navText" href="#">Another action</a></li>
                            <li>
                                <hr class="dropdown-divider">
                            </li>
                            <li><a class="dropdown-item navText" href="#">Something else here</a></li>
                        </ul>
                    </li>

                </ul>
                <form class="d-flex">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                    <button class="btn btn-outline-success" type="submit">Search</button>
                </form>
            </div>
        </div>
    </nav>
`;