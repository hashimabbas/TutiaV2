<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>E-commerce </title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport">
        <meta content="E-commerce " name="keywords">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <meta content="Matger-TUTIA electronically selling of products on online services or over the Internet with several
        types of payment methods" name="description">

        <!-- Favicon -->
        <link href="/images/logo.jpg" rel="icon">

        <!-- Google Font -->
        <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        
        <!-- CSS Libraries -->
        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
        <link href="{{ asset('lib/') }}flaticon/font/flaticon.css" rel="stylesheet">
        <link href="{{ asset('lib/') }}animate/animate.min.css" rel="stylesheet">
        <link href="{{ asset('lib/') }}owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">

        <!-- Template Stylesheet -->
        <link href="{{ asset('css/') }}style.css" rel="stylesheet">
    </head>

    <body>
        <!-- Top Bar Start -->
        <div class="top-bar d-none d-md-block">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-8">
                        <div class="top-bar-left">
                            <div class="text">
                                <i class="fa fa-phone-alt"></i>
                                <p>+249912329449</p>
                            </div>
                            <div class="text">
                                <i class="fa fa-envelope"></i>
                                <p>info@tutiasd.com</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="top-bar-right">
                            <div class="social">
                                <a href="https://twitter.com/TradingTutia" target="_blank"><i class="fab fa-twitter"></i></a>
                                <a href="https://web.facebook.com/TUTIA.Sd" target="_blank"><i class="fab fa-facebook-f"></i></a>
                                <a href="https://play.google.com/store/apps/details?id=com.nilogy.matgertutia" target="_blank"><i class="fab fa-android"></i></a>
                                <a href="https://apps.apple.com/us/app/%D9%85%D8%AA%D8%AC%D8%B1-%D8%AA%D9%88%D8%AA%D9%8A%D8%A7-matger-tutia/id1460172160" target="_blank"><i class="fab fa-apple"></i></a>
                                <a href="https://www.instagram.com/matgertutia/" target="_blank"><i class="fab fa-instagram"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Top Bar End -->

        <!-- Nav Bar Start -->
        <div class="navbar navbar-expand-lg bg-dark navbar-dark">
            <div class="container-fluid">
                <a href="{{url('/')}}" style="font-size: 1.8rem" class="navbar-brand"><img src="{{ asset('images/') }}logo.jpg" alt="Logo" width="40px" height="40px" style="border-radius: 30px;"> TUTIA</a>
                <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                    <div class="navbar-nav ml-auto">
                        <a href="{{url('/')}}" class="nav-item nav-link">Home</a>
                        <div class="nav-item dropdown">
                            <a href="#" class="nav-link dropdown-toggle active" data-toggle="dropdown">Services</a>
                            <div class="dropdown-menu">
                                <a href="{{url('/ecommerce')}}" class="dropdown-item">E-Commerce</a>
                                <a href="{{url('/sms')}}" class="dropdown-item">Bulk SMS</a>
                                <a href="{{url('/web')}}" class="dropdown-item">Web Development</a>
                                <a href="{{url('/connectivity')}}" class="dropdown-item">Connectivity Solution</a>
                                <a href="{{url('/ict')}}" class="dropdown-item">ICT Consulting</a>
                                <a href="{{url('/call_center')}}" class="dropdown-item">Call Center</a>
                                <a href="{{url('/ticketing')}}" class="dropdown-item">Ticketing System</a>
                                <a href="{{url('/vpn')}}" class="dropdown-item">VPN</a>
                                <a href="{{url('/payment')}}" class="dropdown-item">Payment Gateway</a>
                                <a href="{{url('/erp')}}" class="dropdown-item">ERP System</a>
                            </div>
                        </div>
                        <a href="{{url('/contact')}}" class="nav-item nav-link">Contact</a>
                    </div>
                </div>
            </div>
        </div>
        <!-- Nav Bar End -->
        
        
        <!-- Page Header Start -->
        <div class="page-header">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <h2>E-commerce </h2>
                    </div>
                    <div class="col-12">
                        <a href="{{url('/')}}">Home</a>
                        <a href="#">Services</a>
                    </div>
                </div>
            </div>
        </div>
        <!-- Page Header End -->


        <!-- Single Post Start-->
        <div class="single">
            <div class="container">
                <div class="row">
                    <div class="col-lg-2"></div>
                    <div class="col-lg-8">
                        <div class="single-content">
                            <img src="{{ asset('images/') }}services/online-shop-g7a91d4a91_640.png" />
                            <h3>E-commerce </h3>
                            <p>
                                Our big project in E-commerce is <span>Matger-TUTIA</span><br>
                                <span>Matger-TUTIA</span> is a B2C e-commerce at whitch we provide an
                                electronic market helping community shopping form home
                            </p>
                            <p>
                                Matger-TUTIA electronically selling of products on online services or over the Internet with several
                                types of payment methods.<br><br>
                                This e-commerce project is presented by mobile application for both android and IOS devices and by
                                website that is www.Matger-tutia.sd.<br><br>
                                Matger-TUTIA helps the society in brand building, at which we provide products with a brand high quality
                                and fast delivery.<br><br>
                                Matger-TUTIA is full of all house needs and family necessities, electronic devices, child needs, women
                                products, cosmetics, toys, furniture, perfumes...etc<br><br>
                                Website <a href="https://matger-tutia.com/" target="_blank">Matger-TUTIA</a>
                                <br>
                            </p>
                        </div>
                       
                    </div>

                </div>
            </div>
        </div>
        <!-- Single Post End-->   

        <!-- Contact Start -->
        <div class="contact">
            <div class="container">
                <div class="section-header text-center">
                    <p style="margin: 0;font-size: 45px;font-weight: 700;color: #2980b9">Contact Us</p>
                </div>
                <div class="contact-img">
                    <img src="{{ asset('images/') }}laptop-g90.jpg" alt="Image">
                </div>
                <div class="contact-form">
                        <div id="success"></div>
                        <form name="sentMessage" action="{{url('/create/message')}}" method="post" id="contactForm" novalidate="novalidate">
                            @csrf
                            <div class="control-group">
                                <input type="text" class="form-control" name="name" id="name" placeholder="Your Name" required="required" data-validation-required-message="Please enter your name" />
                                <p class="help-block text-danger"></p>
                            </div>
                            <div class="control-group">
                                <input type="email" class="form-control" name="email" id="email" placeholder="Your Email" required="required" data-validation-required-message="Please enter your email" />
                                <p class="help-block text-danger"></p>
                            </div>
                            <div class="control-group">
                                <input type="text" class="form-control" name="subject" id="subject" placeholder="Subject" required="required" data-validation-required-message="Please enter a subject" />
                                <p class="help-block text-danger"></p>
                            </div>
                            <div class="control-group">
                                <textarea class="form-control" id="message" name="content" placeholder="Message" required="required" data-validation-required-message="Please enter your message"></textarea>
                                <p class="help-block text-danger"></p>
                            </div>
                            <div>
                                <button class="btn btn-custom" type="submit" id="sendMessageButton">Send Message</button>
                            </div>
                        </form>
                    </div>
            </div>
        </div>
        <!-- Contact End -->

        <div class="whatsup-chat">
            <a href="https://wa.me/249912329449" target="_blank">
                <img src="{{ asset('images/') }}whatsapp-icon-.jpg" width="60px"  height="60px" alt="whatsup-logo">
            </a>
        </div>
   
         <!--End of Tawk.to Script-->

        <!-- Footer Start -->
        <div class="footer">
            <div class="container">
                <div class="row">
                    <div class="col-lg-4 col-md-6">
                        <div class="footer-contact">
                            <h2>Contact Info</h2>
                            <p><i class="fa fa-map-marker-alt"></i>Khartoum - Sudan| P.O Box: 77003</p>
                            <p><i class="fa fa-phone-alt"></i><a href="tel:+249912329449" style="color: #FFF;">+249912329449</a></p>
                            <p><i class="fa fa-phone-alt"></i><a href="tel:+249965502009" style="color: #FFF;">+249965502009</a></p>
                            <p><a href="mailto: info@tutia.sd" target="_blank" style="color: #FFF;" rel="noopener noreferrer"><i class="fa fa-envelope"></i>info@tutiasd.com</a></p>
                            <div class="footer-social">
                                <a class="btn btn-custom" href="https://twitter.com/TradingTutia" target="_blank"><i class="fab fa-twitter"></i></a>
                                <a class="btn btn-custom" href="https://web.facebook.com/TUTIA.Sd" target="_blank"><i class="fab fa-facebook-f"></i></a>
                                <a class="btn btn-custom" href="https://play.google.com/store/apps/details?id=com.nilogy.matgertutia" target="_blank"><i class="fab fa-android"></i></a>
                                <a class="btn btn-custom" href="https://apps.apple.com/us/app/%D9%85%D8%AA%D8%AC%D8%B1-%D8%AA%D9%88%D8%AA%D9%8A%D8%A7-matger-tutia/id1460172160" target="_blank"><i class="fab fa-apple"></i></a>
                                <a class="btn btn-custom" href="https://www.instagram.com/matgertutia/" target="_blank"><i class="fab fa-instagram"></i></a>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="footer-link">
                            <h2>Popular Links</h2>
                            <a href="{{url('/contact')}}">Contact Us</a>
                            <a href="https://apps.apple.com/us/app/%D9%85%D8%AA%D8%AC%D8%B1-%D8%AA%D9%88%D8%AA%D9%8A%D8%A7-matger-tutia/id1460172160" target="_blank">Matger Tutia Apple App</a>
                            <a href="https://play.google.com/store/apps/details?id=com.nilogy.matgertutia" target="_blank">Matger Tutia Android App</a>
                            <a href="http://sms.matger-tutia.com/" target="_blank">SMS-Matger-TUTIA</a>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="footer-link">
                            <h2>Popular Services</h2>
                            <a href="https://matger-tutia.com/">Matger-TUTIA</a>
                            <a href="http://sms.matger-tutia.com/">Bulk SMS</a>
                            <a href="{{url('/web')}}">Web Development</a>
                            <a href="{{url('/ict')}}">ICT Consultancey </a>
                            <a href="{{url('/connectivity')}}">Connectivity Solution</a>
                            <a href="{{url('/erp')}}">Call Center </a>
                            <a href="{{url('/call_center')}}">ERP Systems </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container copyright">
                <div class="row">
                    <div class="col-md-6">
                        <p class="footer-in-phone"><a href="#">TUTIA</a>, All Right Reserved &copy; {{date('Y')}}</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- Footer End -->

        <!-- Back to top button -->
        <a href="#" class="back-to-top"><i class="fa fa-chevron-up"></i></a>
        
        <!-- Pre Loader -->
        <div id="loader" class="show">
            <div class="loader"></div>
        </div>

        <!-- JavaScript Libraries -->
        <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.bundle.min.js"></script>
        <script src="{{ asset('lib/') }}easing/easing.min.js"></script>
        <script src="{{ asset('lib/') }}owlcarousel/owl.carousel.min.js"></script>
        <script src="{{ asset('lib/') }}waypoints/waypoints.min.js"></script>
        <script src="{{ asset('lib/') }}counterup/counterup.min.js"></script>
        <script src="{{ asset('lib/') }}parallax/parallax.min.js"></script>
        
        <!-- Contact Javascript File -->
        <script src="{{ asset('mail/') }}jqBootstrapValidation.min.js"></script>
        <script src="{{ asset('mail/') }}contact.js"></script>

        <!-- Template Javascript -->
        <script src="{{ asset('js/') }}main.js"></script>
    </body>
</html>

