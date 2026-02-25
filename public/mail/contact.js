$(function () {
    // Form validation
    $('#contactForm input, #contactForm textarea').jqBootstrapValidation({
        preventSubmit: true,
        submitError: function ($form, event, errors) {},
        submitSuccess: function ($form, event) {
            event.preventDefault();
            var name = $('input#name').val();
            var email = $('input#email').val();
            var subject = $('input#subject').val();
            var content = $('textarea#message').val();

            console.log(name); // Logging the name for debugging

            // Disable the send button
            var $this = $('#sendMessageButton');
            $this.prop('disabled', true);

            // Setup CSRF token
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr(
                        'content',
                    ),
                },
            });

            // AJAX request
            $.ajax({
                url: '/contact', // This matches your POST route
                method: 'POST',
                data: {
                    name: name,
                    email: email,
                    subject: subject,
                    content: content,
                },
                success: function (response) {
                    $('#success').html("<div class='alert alert-success'>");
                    $('#success > .alert-success').html(
                        "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>",
                    );
                    $('#success > .alert-success').append(
                        '<strong>Your message has been sent!</strong>',
                    );
                    $('#success > .alert-success').append('</div>');
                    $('#contactForm').trigger('reset'); // Reset the form
                },
                error: function (response) {
                    $('#success').html("<div class='alert alert-danger'>");
                    $('#success > .alert-danger').html(
                        "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>",
                    );
                    $('#success > .alert-danger').append(
                        $('<strong>').text(
                            'Sorry, it seems that our server is not responding. Please try again later.',
                        ),
                    );
                    $('#success > .alert-danger').append('</div>');
                    $('#contactForm').trigger('reset');
                },
                complete: function () {
                    setTimeout(function () {
                        $this.prop('disabled', false); // Re-enable the button
                    }, 1000);
                },
            });
        },
        filter: function () {
            return $(this).is(':visible');
        },
    });

    $("a[data-toggle='tab']").click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
});

$('#name').focus(function () {
    $('#success').html(''); // Clear success/error message when user starts typing
});
