export default function PublicHeading({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <div className="mb-8 space-y-0.5">
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
        <link href="css/bootstrap.min.css" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
        <link href="lib/flaticon/font/flaticon.css" rel="stylesheet">
        <link href="lib/animate/animate.min.css" rel="stylesheet">
        <link href="lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">

        <!-- Template Stylesheet -->
        <link href="css/style.css" rel="stylesheet">

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
        <script src="js/jquery.min.js"></script>
        <script src="js/bootstrap.bundle.min.js"></script>
        <script src="lib/easing/easing.min.js"></script>
        <script src="lib/owlcarousel/owl.carousel.min.js"></script>
        <script src="lib/waypoints/waypoints.min.js"></script>
        <script src="lib/counterup/counterup.min.js"></script>
        <script src="lib/parallax/parallax.min.js"></script>

        <script src="https://unpkg.com/scrollreveal"></script>

        <!-- Contact Javascript File -->
        <script src="mail/jqBootstrapValidation.min.js"></script>
        <script src="mail/contact.js"></script>

        <!-- Template Javascript -->
        <script src="js/main.js"></script>

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
        </div>
    );
}
