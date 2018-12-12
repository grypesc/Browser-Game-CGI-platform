#!/usr/bin/perl

use CGI;
use CGI::Cookie;
use CGI::Carp qw(fatalsToBrowser);


$cgi=CGI->new;





if($cgi->param("name"))
{
	$file= $cgi->param("name");
	open(IN,$file) || die "can't read $file";
	@lines=<IN>;
	close IN;
	print $cgi->header(-type=>"text/plain");
	print @lines;
}
