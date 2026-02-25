<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Contact Us</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta content="tutia contact" name="keywords">
        <meta content="TUTIA is leading Sudanese company providing information technology services consulting , implementing and support. It envisioned and instigated the adoption of the flexible technology practices to operate efficiently and produce more value" name="description">

        <!-- Favicon -->
        <link href="/images/logo.jpg" rel="icon">

        <!-- Google Font -->
        <!--<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">-->

        <!-- CSS Libraries -->
        <link href="{{ asset('css/') }}bootstrap.min.css" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
        <link href="{{ asset('lib/') }}flaticon/font/flaticon.css" rel="stylesheet">
        <link href="{{ asset('lib/') }}animate/animate.min.css" rel="stylesheet">
        <link href="{{ asset('lib/') }}owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">

        <!-- Template Stylesheet -->
        <link href="{{ asset('css/') }}style.css" rel="stylesheet">
    </head>

    <body>
        @if (session()->has('message'))
            <div class="alert alert-success text-center" style="font-size: 2rem;" role="alert">
            {{session()->get('message')}}
            </div>
        @endif
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
                            <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">Services</a>
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
                        <a href="{{url('/contact')}}" class="nav-item nav-link active">Contact</a>
                    </div>
                </div>
            </div>
        </div>
        <!-- Nav Bar End -->


        <!-- Carousel Start -->
        <div class="carousel">
            <div class="container-fluid">
                <div class="owl-carousel">
                    <div class="carousel-item">
                        <div class="carousel-img">
                            <img src="{{ asset('images/') }}workspace.jpg" alt="Image">
                        </div>
                        <div class="carousel-text">
                            <h1 style="font-size: 2rem">TUTIA Trading Services</h1>
                            <p>
                                Unlimited Trust
                            </p>
                            <div class="carousel-btn">
                                <a class="btn btn-custom" href="https://play.google.com/store/apps/details?id=com.nilogy.matgertutia" target="_blank"><span >Matger Tutia</span> <i class="fab fa-android fa-2x " style="color: #a4c639;"></i></a>
                                <a class="btn btn-custom btn-play" href="https://apps.apple.com/us/app/%D9%85%D8%AA%D8%AC%D8%B1-%D8%AA%D9%88%D8%AA%D9%8A%D8%A7-matger-tutia/id1460172160"  target="_blank">Matger Tutia <i class="fab fa-apple fa-2x"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Carousel End -->


        <!-- Contact Start -->
        <div class="contact">
            <div class="container">
                <div class="section-header text-center">
                    <p style="margin: 0;font-size: 45px;font-weight: 700;color: #4a4c70">Contact Us</p>
                </div>
                <div class="contact-img">
                    <img src="{{ asset('images/') }}laptop-g90.jpg" alt="Image">
                </div>
                <div class="contact-form">
                        <div id="success"></div>
                         <!-- CRITICAL CHANGE 1: ADD enctype="multipart/form-data" -->
                          <form name="sentMessage" action="{{route('contact.store')}}" method="post" id="contactForm" enctype="multipart/form-data" novalidate="novalidate">
                            @csrf

                            <!-- Display Validation Errors (Top of Form) -->
                            @if ($errors->any())
                                <div class="alert alert-danger" style="font-size: 1rem; margin-bottom: 15px;">
                                    <strong>Validation Error:</strong> Please check the fields below.
                                </div>
                            @endif

                            <!-- Display Session Success Message -->
                            @if (session('success'))
                                <div class="alert alert-success text-center" role="alert" style="font-size: 1.5rem; margin-bottom: 15px;">
                                    {{ session('success') }}
                                </div>
                            @endif


                            <div class="control-group">
                                <input type="text" class="form-control" name="name" id="name" placeholder="Your Name" value="{{ old('name') }}" required="required" />
                                <!-- Check for specific 'name' error -->
                                @error('name')
                                    <p class="help-block text-danger">{{ $message }}</p>
                                @enderror
                            </div>

                            <div class="control-group">
                                <input type="email" class="form-control" name="email" id="email" placeholder="Your Email" value="{{ old('email') }}" required="required" />
                                <!-- Check for specific 'email' error -->
                                @error('email')
                                    <p class="help-block text-danger">{{ $message }}</p>
                                @enderror
                            </div>

                            <div class="control-group">
                                <input type="text" class="form-control" name="phone" id="phone" placeholder="Your Phone (Optional)" value="{{ old('phone') }}" />
                                @error('phone')
                                    <p class="help-block text-danger">{{ $message }}</p>
                                @enderror
                            </div>

                            <div class="control-group">
                                <label for="attachment" style="font-size: 0.9rem; color: #666;">Attach File (PDF, Image, DOCX, Max 5MB)</label>
                                <input type="file" class="form-control" name="attachment" id="attachment" style="padding-top: 10px; padding-bottom: 30px;" />
                                @error('attachment')
                                    <p class="help-block text-danger">{{ $message }}</p>
                                @enderror
                            </div>

                            <div class="control-group">
                                <textarea class="form-control" id="message" name="message" placeholder="Message" required="required">{{ old('message') }}</textarea>
                                @error('message')
                                    <p class="help-block text-danger">{{ $message }}</p>
                                @enderror
                            </div>

                            <div>
                                <button class="btn btn-custom" type="submit" id="sendMessageButton">Send Message</button>
                            </div>
                        </form>
                    </div>
            </div>
        </div>
        <!-- Contact End -->

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
        <script src="{{ asset('js/') }}jquery.min.js"></script>
        <script src="{{ asset('js/') }}bootstrap.bundle.min.js"></script>
        <script src="{{ asset('lib/') }}easing/easing.min.js"></script>
        <script src="{{ asset('lib/') }}owlcarousel/owl.carousel.min.js"></script>
        <script src="{{ asset('lib/') }}waypoints/waypoints.min.js"></script>
        <script src="{{ asset('lib/') }}counterup/counterup.min.js"></script>
        <script src="{{ asset('lib/') }}parallax/parallax.min.js"></script>

        <!-- Contact Javascript File -->
        {{-- <script src="{{ asset('mail/') }}jqBootstrapValidation.min.js"></script>
        <script src="{{ asset('mail/') }}contact.js"></script> --}}

        <!-- Template Javascript -->
        <script src="{{ asset('js/') }}main.js"></script>
    </body>
</html>

