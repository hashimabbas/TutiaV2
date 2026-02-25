<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Tutia</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta content="" name="keywords">
        <meta content="TUTIA is leading Sudanese company providing information technology services consulting , implementing and support. It envisioned and instigated the adoption of the flexible technology practices to operate efficiently and produce more value" name="description">

        <link href="/images/logo.jpg" rel="icon">

        <!-- Favicon -->

        <!-- Google Font -->
        <!--<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">-->

        <!-- CSS Libraries -->
        <link href="{{ asset('css/bootstrap.min.css') }}" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
        <link href="{{ asset('lib/flaticon/font/flaticon.css') }}" rel="stylesheet">
        <link href="{{ asset('lib/animate/animate.min.css') }}" rel="stylesheet">
        <link href="{{ asset('lib/owlcarousel/assets/owl.carousel.min.css') }}" rel="stylesheet">
        
        <!-- Template Stylesheet -->
        <link href="{{ asset('css/style.css') }}" rel="stylesheet">

    </head>
    <style>
        .header-btn
        {
            border: 2px solid #FDBE33 !important;
        }
        .header-btn:hover{
            box-shadow: inset 0 0 0 30px #FDBE33 !important;
        }
        @media(max-width: 767px)
        {
            .carousel .carousel-img
            {
                height: 500px !important;
            }
            .footer-in-phone{
                text-align: left !important;
            }
            .hero-heading
            {
                font-size: 1.5rem !important;
            }
            .about-img
            {
                display: none;
            }
            .carousel
            {
                margin-bottom: 0 !important;
            }
        }
    </style>
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
                        <a href="{{url('/')}}" class="nav-item nav-link active">Home</a>
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
                        <a href="{{url('/contact')}}" class="nav-item nav-link">Contact</a>
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
                            <h1 style="font-size: 2rem" class="hero-heading">TUTIA Trading Services</h1>
                            <p>
                                Unlimited Trust
                            </p>
                            <div class="carousel-btn">
                                <a class="btn btn-custom header-btn" href="https://play.google.com/store/apps/details?id=com.nilogy.matgertutia" target="_blank"><span >Matger Tutia</span> <i class="fab fa-android fa-2x " style="color: #a4c639;"></i></a>
                                <a class="btn btn-custom  header-btn" href="https://apps.apple.com/us/app/%D9%85%D8%AA%D8%AC%D8%B1-%D8%AA%D9%88%D8%AA%D9%8A%D8%A7-matger-tutia/id1460172160"  target="_blank">Matger Tutia <i class="fab fa-apple fa-2x"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Carousel End -->


        <!-- About Start -->
        <div class="about" style="margin-bottom: 50px;">
            <div class="container">
                <div class="row align-items-center">
                     <div class="col-lg-6">
                        <div class="about-img" data-parallax="scroll" data-image-src="{{ asset('images/') }}desk.jpg"></div>
                    </div>
                    <div class="col-lg-6">
                        <div class="section-header" style="margin: 50px 0;">
                            <p class="h3">About Us</p>
                        </div>
                        <div class="about-tab">
                            <ul class="nav nav-pills nav-justified">
                                <li class="nav-item">
                                    <a class="nav-link active" data-toggle="pill" href="#tab-content-1">About</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-toggle="pill" href="#tab-content-2">Mission</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" data-toggle="pill" href="#tab-content-3">Vision</a>
                                </li>
                            </ul>

                            <div class="tab-content">
                                <div id="tab-content-1" class="container tab-pane active">
                                    TUTIA is leading Sudanese company providing information technology services consulting , implementing and support. It envisioned and instigated the adoption of the flexible technology practices to operate efficiently and produce more value. <br>
                                    At Tutia we live by a set of values that drive our daily behavior and enable us to achieve our vision and goals.
                                </div>
                                <div id="tab-content-2" class="container tab-pane">
                                    We will continue to challenge ourselves and set new performance standards by investing in the future of our Customers and seeking knowledge and innovation in order to exceed expectations in serving our community.
                                </div>
                                <div id="tab-content-3" class="container tab-pane fade">
                                    Our Vision To remain the Preferred ICT & Trading Company in Sudan, leading the Technology Market Growth in Sudan and expanding in the region within adjacent countries, driving economic prosperity, and providing the highest Value for all our stakeholders through operational excellence.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- About End -->


        <!-- Service Start -->
        <div class="service">
            <div class="container">
                <div class="section-header text-center">
                    <p style="color: #34495e;font-size: 2rem;font-weight: 700;color: #2980b9;">Our Values</p>
                    <p class="h3" style="color: #34495e; font-size: 18px;">Our values express the expectations of ourselves and others to identify how we conduct business decisions and action</p>
                </div>
                <div class="row">
                    <div class="col-lg-4 col-md-6">
                        <div class="service-item">
                            <div class="service-icon">
                                <img src="{{ asset('images/') }}values/trust.png" class="trust-icon-animation" alt="">
                                <i class="flaticon-trust"></i>
                            </div>
                            <div class="service-text trust-animation">
                                <p class="h3">Trust</p>
                                <p>"We know that trust must be earned, so we strive every day to act in ways to build up trust in our clients, ourselves and others."</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="service-item">
                            <div class="service-icon">
                                <img src="{{ asset('images/') }}values/commitment.png" class="commitment-icon-animation" alt="">
                            </div>
                            <div class="service-text commitment-animation">
                                <p class="h3">Commitment</p>
                                <p>We recognize the importance of providing excellent services and creating an environment where commitment is part of the fabric of who we are! </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="service-item">
                            <div class="service-icon">
                                <img src="{{ asset('images/') }}values/integration.png" class="integrity-icon-animation" alt="">
                            </div>
                            <div class="service-text integrity-animation">
                                <p class="h3">Integrity</p>
                                <p>We value our reputation and conduct our business with Integrity, honesty, and respect for each individual. We will be as open as we can be with our clients and our people</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div class="service-item">
                            <div class="service-icon">
                                <img src="{{ asset('images/') }}values/stadistics.png" class="result-icon-animation" alt="">
                            </div>
                            <div class="service-text result-animation">
                                <p class="h3">Result Orientation</p>
                                <p>We seek to deliver excellent results and we ansure our clients and customers that our results will absolutely exceed their expectations </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Service End -->

        <!-- Event Start -->
        <div class="event">
            <div class="container">
                <div class="section-header text-center">
                    <p style="margin: 0;font-size: 2.2rem;font-weight: 700;color: #2980b9;">Our Services</p>
                </div>
                <div class="row">
                    <div class="col-lg-4">
                        <div class="event-item e-commerce-animation">
                            <img src="{{ asset('images/') }}services/e-commerce-gee.png" width="350" height="233.333" alt="Image">
                            <div class="event-content">
                                <div class="event-text">
                                    <h3>E-commerce</h3>
                                    <p>
                                        Matger-TUTIA electronically selling of products on online services or over the Internet with several types of payment ....
                                    </p>
                                    <a class="btn btn-custom" href="{{url('/ecommerce')}}">More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="event-item sms-animation">
                            <img src="{{ asset('images/') }}services/sms-bluk-service.jpg" width="350" height="233.333" alt="Image">
                            <div class="event-content">
                                <div class="event-text">
                                    <h3>Bluk SMS</h3>
                                    <p>
                                        Now in this competitive business TUTIA SMS marketing services has expanded it wings and started delivering efﬁcient   ....
                                    </p>
                                    <a class="btn btn-custom" href="{{url('/sms')}}">More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="event-item web-animation">
                            <img src="{{ asset('images/') }}services/web-design.jpg" width="350" height="233.333" alt="Image">
                            <div class="event-content">
                                <div class="event-text">
                                    <h3>Web Development</h3>
                                    <p>
                                        We design static and dynamic websites for all fields according to high quality principles and standards ...
                                    </p>
                                    <a class="btn btn-custom" href="{{url('/web')}}">More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4">
                        <div class="event-item ict-animation">
                            <img src="{{ asset('images/') }}services/business-gbf.jpg" width="350" height="233.333" alt="Image">
                            <div class="event-content">
                                <div class="event-text">
                                    <h3>ICT Consultancey</h3>
                                    <p>
                                        Our information and communications technology(ICT) consultancey enusures technology not only meets the requirements of ...
                                    </p>
                                    <a class="btn btn-custom" href="{{url('/ict')}}">More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="event-item connectivity-animation">
                            <img src="{{ asset('images/') }}services/network-g.jpg" width="350" height="233.333" alt="Image">
                            <div class="event-content">
                                <div class="event-text">
                                    <h3>Connectivity Solution</h3>
                                    <p>
                                        We use the latest and most advanced mobile coverage solutions approved by service provider with all network ....
                                    </p>
                                    <a class="btn btn-custom" href="{{url('/connectivity')}}">More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="event-item ticketing-animation">
                            <img src="{{ asset('images/') }}services/tickting.png" width="350" height="233.333" alt="Image">
                            <div class="event-content">
                                <div class="event-text">
                                    <h3>Ticketing System</h3>
                                    <p>
                                        TUTIA ticketing system is software that automates your sales, marketing, operations, and ﬁnances. Our software ......
                                    </p>
                                    <a class="btn btn-custom" href="{{url('/ticketing')}}">More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4">
                        <div class="event-item payment-animation">
                            <img src="{{ asset('images/') }}services/payment.jpg" width="350" height="233.333" alt="Image">
                            <div class="event-content">
                                <div class="event-text">
                                    <h3>Payment Gateway</h3>
                                    <p>
                                        With TUTIA Payment gateway work with all major credit card networks, digital wallets, and ecommerce platforms ...
                                    </p>
                                    <a class="btn btn-custom" href="{{url('/payment')}}">More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="event-item vpn-animation">
                            <img src="{{ asset('images/') }}services/vpn_safety.jpg" width="350" height="233.333" alt="Image">
                            <div class="event-content">
                                <div class="event-text">
                                    <h3>VPN</h3>
                                    <p>
                                        Using TUTIA VPNs is extremely important for any modern business which has a ﬂexible and mobile workforce. As .......
                                    </p>
                                    <a class="btn btn-custom" href="{{url('/vpn')}}">More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="event-item erp-animation">
                            <img src="{{ asset('images/') }}services/erp.jpg" width="350" height="233.333" alt="Image">
                            <div class="event-content">
                                <div class="event-text">
                                    <h3>ERP Systems</h3>
                                    <p>
                                        Increase control over your business with software designed to grow with you. Streamline key ...
                                    </p>
                                    <a class="btn btn-custom" href="{{url('/erp')}}">More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4">
                        <div class="event-item call-animation">
                            <img src="{{ asset('images/') }}services/call-centre.jpg" width="350" height="233.333" alt="Image">
                            <div class="event-content">
                                <div class="event-text">
                                    <h3>Call Center</h3>
                                    <p>
                                        When a call center modernizes beyond phone calls to support digital channels, it’s even more critical to integrate .....
                                    </p>
                                    <a class="btn btn-custom" href="{{url('/call_center')}}">More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Event End -->


        <!-- Customer Start -->
        <div class="causes">
            <div class="container">
                <div class="section-header text-center">
                    <p style="margin: 0;font-size: 2rem;font-weight: 700;color: #2980b9">Our Customer</p>
                </div>
                <div class="owl-carousel causes-carousel">
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/u.s.embassy.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/biritish-conucil.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/inifinity.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/icrc.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/hyundai.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/nissan.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/jac.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/sudia-cargo.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/bdr.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/sanofi.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/faisal.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/financial.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/bayan.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/noor-pay.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/daman-integrated-solutions.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/kbc.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/tad.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/takt.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/captial.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/sormed.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/h.minister.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/tabi3i.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/lenox.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/khaish&more.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/wain.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/haveing.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/soloclass.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/mobipay.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/adeela.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/awad.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/bajaj.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/miralbi.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/unity.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/connect.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/pure.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/sufian.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/shaza.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/london.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/seti.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}customers/elnamama.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Customer End -->

        <!-- Partner Start -->
        <div class="causes" style="margin-top: 167px;">
            <div class="container">
                <div class="section-header text-center">
                    <p style="margin: 0;font-size: 2rem;font-weight: 700;color: #2980b9">Our Partner</p>
                </div>
                <div class="owl-carousel causes-carousel">
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}partner/bank-khartoum.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}partner/connect.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}partner/D.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}partner/maestros.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}partner/next.jpg" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}partner/nilogy.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    {{-- <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}partner/tradive.png" width="156" height="100" alt="Image">
                        </div>
                    </div> --}}
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}partner/trust.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                    <div class="causes-item">
                        <div class="causes-img">
                            <img src="{{ asset('images/') }}partner/zolpay.png" width="156" height="100" alt="Image">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--Partner End -->


        <!-- Testimonial Start -->
        <div class="testimonial">
            <div class="container">
                <div class="section-header text-center">
                    <p style="margin: 0;font-size: 2.2rem;font-weight: 700;color: #2980b9">Testimonial</p>
                </div>
                <div class="owl-carousel testimonials-carousel">
                    <div class="testimonial-item">
                        <div class="testimonial-profile">
                            <img src="{{ asset('images/') }}customers/bdr.png" style="width: 180px;" height="80" alt="Image">
                            <div class="testimonial-name">
                            </div>
                        </div>
                        <div class="testimonial-text">
                            <p>
                                We have worked with Toutia for a long time and we rely on thei ecfficiency and superior quality. They are true to their words in delivering the woik on designated time which exhibits a mark of true professionalism. We really appreciated the way they give their best shot in offering their services, because it saves us a lot of time. Tutia has helped us keep a track on what our competitors were doning. Their team understands the client's needs and puts every possible effort in successfully performing the given task. They are very co-operative and flexible. Tutia upheld their promise of hard work, dedication, discipline and quality. This company leaves no stone unturned when it comes to their services. This and more, we came to know after our business association with these guys. Their product description writing services impressed us to the core and we would definitely want to continue our association with them in the future.                            </p>
                        </div>
                    </div>
                    <div class="testimonial-item">
                        <div class="testimonial-profile">
                            <img src="{{ asset('images/') }}customers/icrc.jpg" alt="Image">
                            <div class="testimonial-name">
                            </div>
                        </div>
                        <div class="testimonial-text">
                            <p>
                                The professional relationship with our Tutia content team hash proven to be beneficial beyond our expectations. The lines of communication with our Tutia project manager are always open and very effective, and the quality of work completed by the team is consistently of a high quality that meets our standards. There is no way we could easily manage the work volume required to keep our site current without the efforts of Tutia. We look forward to continued sucessful working relationship with our Tutia content team and would be comfortable recommending this company to others.                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Testimonial End -->



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
        <script src="{{ asset('js/jquery.min.js') }}"></script>
        <script src="{{ asset('js/bootstrap.bundle.min.js') }}"></script>
        <script src="{{ asset('lib/easing/easing.min.js') }}"></script>
        <script src="{{ asset('lib/owlcarousel/owl.carousel.min.js') }}"></script>
        <script src="{{ asset('lib/waypoints/waypoints.min.js') }}"></script>
        <script src="{{ asset('lib/counterup/counterup.min.js') }}"></script>
        <script src="{{ asset('lib/parallax/parallax.min.js') }}"></script>

        <script src="https://unpkg.com/scrollreveal"></script>

        <!-- Contact Javascript File -->
        <script src="{{ asset('mail/jqBootstrapValidation.min.js') }}"></script>
        <script src="{{ asset('mail/contact.js') }}"></script>

        <!-- Template Javascript -->
        <script src="{{ asset('js/main.js') }}"></script>

             <!--Start of Tawk.to Script-->
    <script type="text/javascript">
        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/625e75b47b967b11798b60ab/1g10fnink';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
        })();
        //get loction of users
        $(document).ready(function () {
            console.log('tes');
            function ipLookUp () {
            $.ajax('http://ip-api.com/json')
            .then(
                function success(response) {
                    console.log('User\'s Location Data is ', response);
                    console.log('User\'s Country', response.country);
                },

                function fail(data, status) {
                    console.log('Request failed.  Returned status of',
                                status);
                }
            );
            }
            ipLookUp()
        });

    </script>
    </body>
</html>

